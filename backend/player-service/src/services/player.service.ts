import { Injectable, Inject, ConflictException, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { IPlayerRepository } from '../interfaces/player-repository.interface';
import { IEventPublisher } from '../interfaces/event-publisher.interface';
import { CreatePlayerDto, UpdatePlayerDto, GameEventDto, GameEventType, PlayerResponseDto, LoginDto, ChangePasswordDto } from '../dtos/player.dto';
import { Player } from '../entities/player.entity';
import { EmailService } from './email.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

/**
 * Servicio de Jugador - Capa de Lógica de Negocio
 * Principios SOLID:
 * - S (Responsabilidad Única): Maneja solo la lógica de negocio relacionada con jugadores
 * - D (Inversión de Dependencias): Depende de abstracciones (interfaces), no de concreciones
 * - O (Abierto/Cerrado): Abierto para extensión, cerrado para modificación
 */
@Injectable()
export class PlayerService {
  constructor(
    @Inject('IPlayerRepository')
    private readonly playerRepository: IPlayerRepository,
    @Inject('IEventPublisher')
    private readonly eventPublisher: IEventPublisher,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Genera una contraseña temporal aleatoria
   */
  private generateTemporaryPassword(): string {
    return crypto.randomBytes(4).toString('hex').toUpperCase(); // 8 caracteres
  }

  /**
   * Registra un nuevo jugador con contraseña temporal
   */
  async registerPlayer(createPlayerDto: CreatePlayerDto): Promise<{ message: string; email: string }> {
    const { username, email } = createPlayerDto;

    // Verificar si el nombre de usuario ya existe
    const existingUsername = await this.playerRepository.findByUsername(username);
    if (existingUsername) {
      throw new ConflictException('El nombre de usuario ya existe');
    }

    // Verificar si el correo electrónico ya existe
    const existingEmail = await this.playerRepository.findByEmail(email);
    if (existingEmail) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    // Generar contraseña temporal
    const temporaryPassword = this.generateTemporaryPassword();
    
    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    // Crear jugador con contraseña hasheada
    await this.playerRepository.createWithPassword(username, email, hashedPassword);

    // Enviar correo con contraseña temporal
    await this.emailService.sendTemporaryPassword(email, temporaryPassword, username);

    return {
      message: 'Registro exitoso. Revisa tu correo para obtener tu contraseña temporal.',
      email
    };
  }

  /**
   * Login de jugador
   */
  async login(loginDto: LoginDto): Promise<Player> {
    const { email, password } = loginDto;

    const player = await this.playerRepository.findByEmail(email);
    if (!player) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, player.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return player;
  }

  /**
   * Cambiar contraseña
   */
  async changePassword(changePasswordDto: ChangePasswordDto): Promise<Player> {
    const { playerId, newPassword } = changePasswordDto;

    const player = await this.playerRepository.findById(playerId);
    if (!player) {
      throw new NotFoundException('Jugador no encontrado');
    }

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña y marcar como cambiada
    return this.playerRepository.updatePassword(playerId, hashedPassword, false);
  }

  /**
   * Obtiene un jugador por ID
   */
  async getPlayerById(id: string): Promise<Player> {
    const player = await this.playerRepository.findById(id);
    
    if (!player) {
      throw new NotFoundException(`Player with id ${id} not found`);
    }

    return player;
  }

  /**
   * Procesa eventos de juego y los publica a RabbitMQ
   * Implementa el patrón Proxy para validación de eventos
   */
  async processGameEvent(gameEventDto: GameEventDto): Promise<Player> {
    const { playerId, eventType, value } = gameEventDto;

    // Validar que el valor sea positivo
    if (value <= 0) {
      throw new BadRequestException('El valor del evento debe ser positivo');
    }

    // Verificar que el jugador existe
    const player = await this.playerRepository.findById(playerId);
    if (!player) {
      throw new NotFoundException(`Jugador con id ${playerId} no encontrado`);
    }

    let updatedPlayer: Player;

    // Procesar evento según su tipo
    switch (eventType) {
      case GameEventType.MONSTER_KILLED:
        updatedPlayer = await this.playerRepository.updateMonsterKills(playerId, value);
        break;
      case GameEventType.TIME_PLAYED:
        updatedPlayer = await this.playerRepository.updateTimePlayed(playerId, value);
        break;
      default:
        throw new BadRequestException(`Unknown event type: ${eventType}`);
    }

    // Publicar evento a RabbitMQ
    await this.eventPublisher.publishPlayerEvent(playerId, eventType, value);

    return updatedPlayer;
  }

  /**
   * Obtiene todos los jugadores activos
   */
  async getAllPlayers(): Promise<Player[]> {
    return this.playerRepository.findAll();
  }

  /**
   * Actualiza un jugador existente
   */
  async updatePlayer(id: string, updatePlayerDto: UpdatePlayerDto): Promise<Player> {
    const { username, email } = updatePlayerDto;

    // Verificar que el jugador existe
    const player = await this.playerRepository.findById(id);
    if (!player) {
      throw new NotFoundException(`Jugador con id ${id} no encontrado`);
    }

    // Verificar unicidad del nombre de usuario si se está actualizando
    if (username && username !== player.username) {
      const existingUsername = await this.playerRepository.findByUsername(username);
      if (existingUsername) {
        throw new ConflictException('El nombre de usuario ya existe');
      }
    }

    // Verificar unicidad del correo electrónico si se está actualizando
    if (email && email !== player.email) {
      const existingEmail = await this.playerRepository.findByEmail(email);
      if (existingEmail) {
        throw new ConflictException('El correo electrónico ya existe');
      }
    }

    return this.playerRepository.update(id, username, email);
  }

  /**
   * Elimina un jugador (eliminación lógica)
   */
  async deletePlayer(id: string): Promise<void> {
    const player = await this.playerRepository.findById(id);
    if (!player) {
      throw new NotFoundException(`Player with id ${id} not found`);
    }

    await this.playerRepository.delete(id);
  }
}

