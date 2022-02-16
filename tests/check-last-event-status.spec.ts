import { reset, set } from 'mockdate';
import { LoadLastEventRepositorySpy } from '../src/repository/implementations/load-last-event-repo-spy';
import { CheckLastEventStatus } from '../src/useCases/events/check-last-event-status';

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
    const { sut, loadLastEventRepository } = makeSut();
    await sut.perform({ groupId });

    expect(loadLastEventRepository.groupId).toBe(groupId);
    expect(loadLastEventRepository.callsCount).toBe(1);
  });

  it('should return status done when group has no event', async () => {
    const { sut, loadLastEventRepository } = makeSut();
    loadLastEventRepository.output = undefined;

    const eventStatus = await sut.perform({ groupId });

    expect(eventStatus.status).toBe('done');
  });

  it('should return status active when now is before event end time', async () => {
    const { sut, loadLastEventRepository } = makeSut();
    loadLastEventRepository.setEndDateAfterToNow();

    const eventStatus = await sut.perform({ groupId });

    expect(eventStatus.status).toBe('active');
  });

  it('should return status active when now is equal to event end time', async () => {
    const { sut, loadLastEventRepository } = makeSut();

    loadLastEventRepository.setEndDateEqualToNow();

    const eventStatus = await sut.perform({ groupId });

    expect(eventStatus.status).toBe('active');
  });

  it('should return status inReview when now is after event end time', async () => {
    const { sut, loadLastEventRepository } = makeSut();

    loadLastEventRepository.setEndDateBeforeToNow();

    const eventStatus = await sut.perform({ groupId });

    expect(eventStatus.status).toBe('inReview');
  });

  it('should return status inReview when now is before review time', async () => {
    const { sut, loadLastEventRepository } = makeSut();

    loadLastEventRepository.setEndDateBeforeReviewDate();

    const eventStatus = await sut.perform({ groupId });

    expect(eventStatus.status).toBe('inReview');
  });

  it('should return status inReview when now is equal to review time', async () => {
    const { sut, loadLastEventRepository } = makeSut();

    loadLastEventRepository.setEndDateEqualReviewDate();

    const eventStatus = await sut.perform({ groupId });

    expect(eventStatus.status).toBe('inReview');
  });

  it('should return status done when now is after to review time', async () => {
    const { sut, loadLastEventRepository } = makeSut();

    loadLastEventRepository.setEndDateAfterReviewDate();

    const eventStatus = await sut.perform({ groupId });

    expect(eventStatus.status).toBe('done');
  });
});
