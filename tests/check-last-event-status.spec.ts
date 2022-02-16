import { reset, set } from 'mockdate';

type EventStatus = { status: string };
class CheckLastEventStatus {
  constructor(
    private readonly loadLastEventRepository: LoadLastEventRepository
  ) {}

  async perform({ groupId }: { groupId: string }): Promise<EventStatus> {
    const event = await this.loadLastEventRepository.loadLastEvent({ groupId });

    if (event === undefined) return { status: 'done' };

    const now = new Date();
    return event.endDate > now ? { status: 'active' } : { status: 'inReview' };
  }
}

interface LoadLastEventRepository {
  loadLastEvent: (input: {
    groupId: string;
  }) => Promise<{ endDate: Date } | undefined>;
}

class LoadLastEventRepositorySpy implements LoadLastEventRepository {
  groupId?: string;
  callsCount = 0;
  output: { endDate: Date } | undefined;

  async loadLastEvent({
    groupId,
  }: {
    groupId: string;
  }): Promise<{ endDate: Date } | undefined> {
    this.groupId = groupId;
    this.callsCount++;

    return this.output;
  }
}

type SutOutput = {
  sut: CheckLastEventStatus;
  loadLastEventRepository: LoadLastEventRepositorySpy;
};

const makeSut = (): SutOutput => {
  const loadLastEventRepository = new LoadLastEventRepositorySpy();
  const sut = new CheckLastEventStatus(loadLastEventRepository);

  return {
    sut,
    loadLastEventRepository,
  };
};

describe('CheckLastEventStatus', () => {
  const groupId: string = 'any_group_id';
  beforeAll(() => {
    set(new Date());
  });

  afterAll(() => {
    reset();
  });

  it('should get last event data', async () => {
    //class method can be either execute/perform
    const { sut, loadLastEventRepository } = makeSut();
    await sut.perform({ groupId });

    expect(loadLastEventRepository.groupId).toBe(groupId);
    expect(loadLastEventRepository.callsCount).toBe(1);
  });

  it('should return status done when group has no event', async () => {
    const { sut, loadLastEventRepository } = makeSut();
    loadLastEventRepository.output = undefined;

    //class method can be either execute/perform
    const eventStatus = await sut.perform({ groupId });

    expect(eventStatus.status).toBe('done');
  });

  it('should return status active when now is before event end time', async () => {
    const loadLastEventRepository = new LoadLastEventRepositorySpy();
    loadLastEventRepository.output = {
      endDate: new Date(new Date().getTime() + 1),
    };

    const sut = new CheckLastEventStatus(loadLastEventRepository);

    //class method can be either execute/perform
    const eventStatus = await sut.perform({ groupId });

    expect(eventStatus.status).toBe('active');
  });

  it('should return status inReview when now is after event end time', async () => {
    const loadLastEventRepository = new LoadLastEventRepositorySpy();
    loadLastEventRepository.output = {
      endDate: new Date(new Date().getTime() - 1),
    };

    const sut = new CheckLastEventStatus(loadLastEventRepository);

    //class method can be either execute/perform
    const eventStatus = await sut.perform({ groupId });

    expect(eventStatus.status).toBe('inReview');
  });
});
