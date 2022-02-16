import { LoadLastEventRepository } from '../load-last-event-repository';

class LoadLastEventRepositorySpy implements LoadLastEventRepository {
  groupId?: string;
  callsCount = 0;
  output?: { endDate: Date; reviewDurationInHours: number };

  setEndDateBeforeToNow(): void {
    this.output = {
      endDate: new Date(new Date().getTime() - 1),
      reviewDurationInHours: 1,
    };
  }

  setEndDateEqualToNow(): void {
    this.output = {
      endDate: new Date(),
      reviewDurationInHours: 1,
    };
  }

  setEndDateAfterToNow(): void {
    this.output = {
      endDate: new Date(new Date().getTime() + 1),
      reviewDurationInHours: 1,
    };
  }

  setEndDateBeforeReviewDate(): void {
    const reviewDurationInHours = 1;
    const reviewDurationInMs = 1 * 60 * 60 * 1000;

    this.output = {
      endDate: new Date(new Date().getTime() - reviewDurationInMs + 1),
      reviewDurationInHours,
    };
  }

  setEndDateEqualReviewDate(): void {
    const reviewDurationInHours = 1;
    const reviewDurationInMs = 1 * 60 * 60 * 1000;

    this.output = {
      endDate: new Date(new Date().getTime() - reviewDurationInMs),
      reviewDurationInHours,
    };
  }

  setEndDateAfterReviewDate(): void {
    const reviewDurationInHours = 1;
    const reviewDurationInMs = 1 * 60 * 60 * 1000;

    this.output = {
      endDate: new Date(new Date().getTime() - reviewDurationInMs - 1),
      reviewDurationInHours,
    };
  }

  async loadLastEvent({
    groupId,
  }: {
    groupId: string;
  }): Promise<{ endDate: Date; reviewDurationInHours: number } | undefined> {
    this.groupId = groupId;
    this.callsCount++;

    return this.output;
  }
}

export { LoadLastEventRepositorySpy };
