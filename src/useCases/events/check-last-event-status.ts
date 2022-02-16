import { EventStatus } from '../../entities/event-status-entity';
import { LoadLastEventRepository } from '../../repository/load-last-event-repository';

class CheckLastEventStatus {
  constructor(
    private readonly loadLastEventRepository: LoadLastEventRepository
  ) {}

  async perform({ groupId }: { groupId: string }): Promise<EventStatus> {
    const event = await this.loadLastEventRepository.loadLastEvent({ groupId });
    return new EventStatus(event);
  }
}

export { CheckLastEventStatus };
