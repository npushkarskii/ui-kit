import {
  MockSearchEngine,
  buildMockSearchAppEngine,
  createMockState,
} from '../../test';
import {buildMockCitation} from '../../test/mock-citation';
import {
  setIsLoading,
  updateCitations,
  updateError,
  updateMessage,
} from './generated-answer-actions';

describe('generated answer', () => {
  let e: MockSearchEngine;

  beforeEach(() => {
    e = buildMockSearchAppEngine({state: createMockState()});
    jest.spyOn(e.apiClient, 'search');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('#updateError', () => {
    const actionType = 'generatedAnswer/updateError';

    it('should accept a full payload', () => {
      const testErrorPayload = {
        message: 'some message',
        code: 500,
      };
      expect(e.dispatch(updateError(testErrorPayload))).toEqual({
        payload: testErrorPayload,
        type: actionType,
      });
    });

    it('should accept a payload without a message', () => {
      const testErrorPayload = {
        code: 500,
      };
      expect(e.dispatch(updateError(testErrorPayload))).toEqual({
        payload: testErrorPayload,
        type: actionType,
      });
    });

    it('should accept a payload without a code', () => {
      const testErrorPayload = {
        message: 'some message',
      };
      expect(e.dispatch(updateError(testErrorPayload))).toEqual({
        payload: testErrorPayload,
        type: actionType,
      });
    });
  });

  describe('#setIsLoading', () => {
    const actionType = 'generatedAnswer/setIsLoading';

    it('should accept a boolean payload', () => {
      expect(e.dispatch(setIsLoading(true))).toEqual({
        payload: true,
        type: actionType,
      });
    });
  });

  describe('#updateMessage', () => {
    const actionType = 'generatedAnswer/updateMessage';

    it('should accept a valid payload', () => {
      const testText = 'some message';
      expect(
        e.dispatch(
          updateMessage({
            textDelta: testText,
          })
        )
      ).toEqual({
        payload: {
          textDelta: testText,
        },
        type: actionType,
      });
    });
  });

  describe('#updateCitations', () => {
    const actionType = 'generatedAnswer/updateCitations';

    it('should accept a valid payload', () => {
      const testCitations = [buildMockCitation()];
      expect(
        e.dispatch(
          updateCitations({
            citations: testCitations,
          })
        )
      ).toEqual({
        payload: {
          citations: testCitations,
        },
        type: actionType,
      });
    });
  });
});