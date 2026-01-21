import { Controller, Post, Put, Get, Delete, Body, Param, ValidationPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { PlayerService } from '../services/player.service';
import { CreatePlayerDto, UpdatePlayerDto, GameEventDto, PlayerResponseDto, LoginDto, ChangePasswordDto } from '../dtos/player.dto';
import { Player } from '../entities/player.entity';

/**
 * Controlador de Jugador - Manejador de Solicitudes HTTP
 * Principios SOLID:
 * - S (Responsabilidad Única): Solo maneja solicitudes/respuestas HTTP
 * - D (Inversión de Dependencias): Depende de la abstracción PlayerService
 */
@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  /**
   * PUT /players
   * Registra un nuevo jugador y envía contraseña temporal por correo
   */
  @Put()
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body(ValidationPipe) createPlayerDto: CreatePlayerDto,
  ): Promise<{ message: string; email: string }> {
    return this.playerService.registerPlayer(createPlayerDto);
  }

  /**
   * POST /players/login
   * Inicia sesión con correo y contraseña
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(ValidationPipe) loginDto: LoginDto,
  ): Promise<Player> {
    return this.playerService.login(loginDto);
  }

  /**
   * POST /players/change-password
   * Cambia la contraseña del jugador
   */
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Body(ValidationPipe) changePasswordDto: ChangePasswordDto,
  ): Promise<Player> {
    return this.playerService.changePassword(changePasswordDto);
  }

  /**
   * GET /players/:id
   * Obtiene información del jugador por ID
   */
  @Get(':id')
  async getPlayer(@Param('id') id: string): Promise<Player> {
    return this.playerService.getPlayerById(id);
  }

  /**
   * POST /players/events
   * Submit a game event for processing
   */
  @Post('events')
  @HttpCode(HttpStatus.OK)
  async submitGameEvent(
    @Body(ValidationPipe) gameEventDto: GameEventDto,
  ): Promise<Player> {
    return this.playerService.processGameEvent(gameEventDto);
  }

  /**
   * GET /players
   * Get all active players
   */
  @Get()
  async getAllPlayers(): Promise<Player[]> {
    return this.playerService.getAllPlayers();
  }

  /**
   * POST /players/:id
   * Update player information
   */
  @Post(':id')
  @HttpCode(HttpStatus.OK)
  async updatePlayer(
    @Param('id') id: string,
    @Body(ValidationPipe) updatePlayerDto: UpdatePlayerDto,
  ): Promise<Player> {
    return this.playerService.updatePlayer(id, updatePlayerDto);
  }

  /**
   * DELETE /players/:id
   * Delete a player (soft delete)
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePlayer(@Param('id') id: string): Promise<void> {
    return this.playerService.deletePlayer(id);
  }
}

