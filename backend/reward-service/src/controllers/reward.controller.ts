import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ValidationPipe,
} from '@nestjs/common';
import { RewardService } from '../services/reward.service';
import { Reward } from '../entities/reward.entity';
import { PlayerBalance } from '../entities/player.balance';

export class AssignRewardDto {
  playerId: string;
  achievementId: string;
  strategy?: string = 'fixed';
}

@Controller('rewards')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @Post('assign')
  async assignReward(
    @Body(ValidationPipe) dto: AssignRewardDto,
  ): Promise<Reward> {
    return this.rewardService.assignReward(
      dto.playerId,
      dto.achievementId,
      dto.strategy || 'fixed',
    );
  }

  @Get()
  async getAllRewards(): Promise<Reward[]> {
    return this.rewardService.getAllRewards();
  }

  @Get('players/:playerId')
  async getPlayerRewards(@Param('playerId') playerId: string): Promise<Reward[]> {
    return this.rewardService.getPlayerRewards(playerId);
  }

  @Get('balance/:playerId')
  async getPlayerBalance(@Param('playerId') playerId: string): Promise<PlayerBalance> {
    return this.rewardService.getPlayerBalance(playerId);
  }

  @Post(':rewardId/claim')
  async claimReward(@Param('rewardId') rewardId: string): Promise<Reward> {
    console.log('[RewardController] Recibida petición de claim para rewardId:', rewardId);
    try {
      const result = await this.rewardService.claimReward(rewardId);
      console.log('[RewardController] Recompensa reclamada exitosamente:', result.id);
      return result;
    } catch (error: any) {
      console.error('[RewardController] Error al reclamar recompensa:', error?.message || String(error));
      throw error;
    }
  }
}
