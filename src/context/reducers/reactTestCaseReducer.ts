import React, { createContext } from 'react';
import { actionTypes } from '../actions/frontendFrameworkTestCaseActions';
import { ReactTestCaseTypes, Action, ItStatements, DescribeBlocks, Statements, Prop, StatementsById, ReactReducerAction } from '../../utils/reactTypes';

// similar to globalReducer, but instead of dealing with global items, this is specific to React, 
// this holds state for things like describe and it statements, basically what your React test looks like
export const reactTestCaseState: ReactTestCaseTypes = {
  modalOpen: false,

  describeId: 1,
  itId: 1,
  statementId: 1,
  propId: 1,
  describeBlocks: {
    byId: {
      describe0: {
        id: 'describe0',
        text: '',
      },
    },
    allIds: ['describe0'],
  },
  itStatements: {
    byId: {
      it0: {
        id: 'it0',
        describeId: 'describe0',
        text: '',
      },
    },
    allIds: {
      describe0: ['it0'],
    },
  },
  statements: {
    byId: {
      statement0: {
        id: 'statement0',
        itId: 'it0',
        describeId: 'describe0',
        type: 'render',
        props: [],
      },
    },
    allIds: ['statement0'],
    componentPath: '',
    componentName: '',
  },
};

/* ---------------------------- Helper Functions ---------------------------- */

const createDescribeBlock = (describeId: string) => {
  return {
    id: describeId,
    text: '',
  };
};

const createItStatement = (describeId: string, itId: string) => ({
  id: itId,
  describeId,
  text: '',
});

const createAction = (describeId: string, itId: string, statementId: string) => ({
  id: statementId,
  itId,
  describeId,
  type: 'action',
  eventType: '',
  eventValue: null,
  queryVariant: '',
  querySelector: '',
  queryValue: '',
  suggestions: [],
});

const createAssertion = (describeId: string, itId: string, statementId: string) => ({
  id: statementId,
  itId,
  describeId,
  type: 'assertion',
  queryVariant: '',
  querySelector: '',
  queryValue: '',
  isNot: false,
  matcherType: '',
  matcherValue: '',
  suggestions: [],
});

const createRender = (describeId: string, itId: string, statementId: string) => ({
  id: statementId,
  itId,
  describeId,
  type: 'render',
  props: [],
});

const createProp = (propId: string, statementId: string) => ({
  id: propId,
  statementId,
  propKey: '',
  propValue: '',
});

// The function deleteChildren, is now split into two separate functions, based on the object type, as trying to reference the type of 'object' based on a conditional statement was throwing errors throughout the reducer actionTypes /////

const deleteItChildren = (object: ItStatements, deletionId: string, lookup: string, it?: string) => {
  let allIdCopy;
  // delete everything appropriate in itStatements.byId object
  object.allIds[deletionId].forEach((id) => {
    delete object.byId[id];
  });
  // delete everything appropriate in itStatements.allIds object
  delete object.allIds[deletionId];
  allIdCopy = object.allIds;
  return allIdCopy;
};

const deleteStatementChildren = (object: Statements, deletionId: string, lookup: 'describeId' | 'itId') => {
  // use .filter to delete from statements.allIds array
  let allIdCopy = object.allIds.filter((id) => object.byId[id][lookup] !== deletionId);
    // delete from statements.byId object
    object.allIds.forEach((id) => {
      if (object.byId[id][lookup] === deletionId) {
        delete object.byId[id];
      }
    });
  return allIdCopy;
}

/* ------------------------- React Test Case Reducer ------------------------ */
/* 
If you have reached this comment in search of trying to resolve type errors of passed in actions of dispatch
functions pointing at this reducer, I have looked at this for several hours and come to the conclusion that the
actions & cases will need to be somewhat (read: completely) rewritten in a more consistent way in order to
satisfy typescript. Unfortunately we are not able to achieve this in the time available to us. For inspiration,
I would encourage you to look at ./hooksTestCaseReducer, which seems to have a workable implementation that could 
be extended to the other reducers. I hope this comment can save you the hours of confusion I experienced when trying
to parse this code. Good luck!
*/
export const reactTestCaseReducer = (state: ReactTestCaseTypes, action: ReactReducerAction) => {
  Object.freeze(state);

  let describeBlocks: DescribeBlocks = { ...state.describeBlocks };
  let itStatements: ItStatements = { ...state.itStatements };
  let statements: Statements = { ...state.statements };

  // Commented this out because the variables had to be initialized before their types could be set

  // if (state && action) {
  //   describeBlocks = { ...state.describeBlocks };
  //   itStatements = { ...state.itStatements };
  //   statements = { ...state.statements };
  // }

  // these are all of the actions that are specific to the test, this will be similar in other frameworks because
  // they funciton the same
  switch (action.type) {
    case actionTypes.RESET_TESTS: {
      return reactTestCaseState;
      };
    case actionTypes.ADD_DESCRIBE_BLOCK: {
      let updatedDescribeId = state.describeId;
      const describeId = `describe${state.describeId}`;

      return {
        ...state,
        describeId: ++updatedDescribeId,
        describeBlocks: {
          ...describeBlocks,
          byId: {
            ...describeBlocks.byId,
            [describeId]: createDescribeBlock(describeId),
          },
          allIds: [...(describeBlocks.allIds || []), describeId],
        },
        itStatements: {
          ...itStatements,
          allIds: {
            ...itStatements.allIds,
            [describeId]: [],
          },
        },
      };
    }
    case actionTypes.DELETE_DESCRIBE_BLOCK: {
      const { describeId } = action;
      const byId = { ...describeBlocks.byId };
      delete byId[describeId];
      const allIds = describeBlocks.allIds.filter((id: string) => id !== describeId);

      const itStatementAllIds = deleteItChildren(itStatements, describeId, 'describeId', 'it');
      const statementAllIds = deleteStatementChildren(statements, describeId, 'describeId');

      return {
        ...state,
        describeBlocks: {
          ...describeBlocks,
          byId: {
            ...byId,
          },
          allIds: [...allIds],
        },
        itStatements: {
          ...itStatements,
          byId: {
            ...itStatements.byId,
          },
          allIds: itStatementAllIds,
        },
        statements: {
          ...statements,
          byId: {
            ...statements.byId,
          },
          allIds: [...statementAllIds],
        },
      };
    }
    case actionTypes.UPDATE_DESCRIBE_TEXT: {
      const { describeId, text } = action;
      const byIds = { ...describeBlocks.byId };
      const block = { ...describeBlocks.byId[describeId] };
      return {
        ...state,
        describeBlocks: {
          ...describeBlocks,
          byId: {
            ...byIds,
            [describeId]: {
              ...block,
              text,
            },
          },
        },
      };
    }
    case actionTypes.UPDATE_DESCRIBE_ORDER: {
      const { reorderedDescribe } = action;
      return {
        ...state,
        describeBlocks: {
          ...describeBlocks,
          allIds: reorderedDescribe,
        },
      };
    }

    case actionTypes.ADD_ITSTATEMENT: {
      const { describeId } = action;
      const itId = `it${state.itId}`;
      let updatedItId = state.itId;

      return {
        ...state,
        itId: ++updatedItId,
        itStatements: {
          ...itStatements,
          byId: {
            ...itStatements.byId,
            [itId]: createItStatement(describeId, itId),
          },
          allIds: {
            ...itStatements.allIds,
            [describeId]: [...itStatements.allIds[describeId], itId],
          },
        },
      };
    }
    case actionTypes.UPDATE_ITSTATEMENT_TEXT: {
      const { itId, text } = action;
      const byIds = { ...itStatements.byId };
      const block = { ...itStatements.byId[itId] };
      return {
        ...state,
        itStatements: {
          ...itStatements,
          byId: {
            ...byIds,
            [itId]: {
              ...block,
              text,
            },
          },
        },
      };
    }
    case actionTypes.DELETE_ITSTATEMENT: {
      const { itId } = action;
      const { describeId } = itStatements.byId[itId];
      const byId = { ...itStatements.byId };
      delete byId[itId];
      const allIds = itStatements.allIds[describeId].filter((id: string) => id !== itId);
      const statementAllIds = deleteStatementChildren(statements, itId, 'itId');

      return {
        ...state,
        itStatements: {
          ...itStatements,
          byId: {
            ...byId,
          },
          allIds: {
            ...itStatements.allIds,
            [describeId]: [...allIds],
          },
        },
        statements: {
          ...statements,
          byId: {
            ...statements.byId,
          },
          allIds: [...statementAllIds],
        },
      };
    }
    case actionTypes.UPDATE_ITSTATEMENT_ORDER: {
      const { reorderedIt, describeId } = action;
      return {
        ...state,
        itStatements: {
          ...itStatements,
          allIds: {
            ...itStatements.allIds,
            [describeId]: reorderedIt,
          },
        },
      };
    }

    case actionTypes.ADD_ACTION: {
      const { describeId, itId } = action;
      const byIds = { ...statements.byId };
      const allIds = [...statements.allIds];
      const statementId = `statement${state.statementId}`;
      let updatedStatementId = state.statementId;

      return {
        ...state,
        statementId: ++updatedStatementId,
        statements: {
          ...statements,
          byId: {
            ...byIds,
            [statementId]: createAction(describeId, itId, statementId),
          },
          allIds: [...allIds, statementId],
        },
      };
    }
    case actionTypes.DELETE_ACTION: {
      const { statementId } = action;
      const byId = { ...statements.byId };
      delete byId[statementId];
      const allIds = [...statements.allIds].filter((statement) => statement !== statementId);
      return {
        ...state,
        statements: {
          ...statements,
          byId: {
            ...byId,
          },
          allIds: [...allIds],
        },
      };
    }
    case actionTypes.UPDATE_ACTION: {
      const { id, eventType, eventValue, queryVariant, querySelector, queryValue, suggestions } =
        action;
      const byId = { ...statements.byId };
      const oldStatement = { ...statements.byId[id] };
      const newStatement = {
        ...oldStatement,
        eventType,
        eventValue,
        queryVariant,
        querySelector,
        queryValue,
        suggestions,
      };
      return {
        ...state,
        statements: {
          ...statements,
          byId: {
            ...byId,
            [id]: {
              ...newStatement,
            },
          },
        },
      };
    }

    case actionTypes.ADD_ASSERTION: {
      const { describeId, itId } = action;
      const byIds = { ...statements.byId };
      const allIds = [...statements.allIds];
      const statementId = `statement${state.statementId}`;
      let updatedStatementId = state.statementId;
      return {
        ...state,
        statementId: ++updatedStatementId,
        statements: {
          ...statements,
          byId: {
            ...byIds,
            [statementId]: createAssertion(describeId, itId, statementId),
          },
          allIds: [...allIds, statementId],
        },
      };
    }
    case actionTypes.DELETE_ASSERTION: {
      const { statementId } = action;
      const byId = { ...statements.byId };
      delete byId[statementId];
      const allIds = [...statements.allIds].filter((statement) => statement !== statementId);
      return {
        ...state,
        statements: {
          ...statements,
          byId: {
            ...byId,
          },
          allIds: [...allIds],
        },
      };
    }
    case actionTypes.UPDATE_ASSERTION: {
      const {
        id,
        queryVariant,
        querySelector,
        queryValue,
        isNot,
        matcherType,
        matcherValue,
        suggestions,
      } = action;
      const oldStatement = { ...statements.byId[id] };
      const byId = { ...statements.byId };
      const newStatement = {
        ...oldStatement,
        queryVariant,
        querySelector,
        queryValue,
        isNot,
        matcherType,
        matcherValue,
        suggestions,
      };
      return {
        ...state,
        statements: {
          ...statements,
          byId: {
            ...byId,
            [id]: {
              ...newStatement,
            },
          },
        },
      };
    }

    case actionTypes.ADD_RENDER: {
      const { describeId, itId } = action;
      const byIds = { ...statements.byId };
      const allIds = [...statements.allIds];
      const statementId = `statement${state.statementId}`;
      let updatedStatementId = state.statementId;

      return {
        ...state,
        statementId: ++updatedStatementId,
        statements: {
          ...statements,
          byId: {
            ...byIds,
            [statementId]: createRender(describeId, itId, statementId),
          },
          allIds: [...allIds, statementId],
        },
      };
    }
    case actionTypes.DELETE_RENDER: {
      const { statementId } = action;
      const byId = { ...statements.byId };
      delete byId[statementId];
      const allIds = [...statements.allIds].filter((statement) => statement !== statementId);
      return {
        ...state,
        statements: {
          ...statements,
          byId: {
            ...byId,
          },
          allIds: [...allIds],
        },
      };
    }
    case actionTypes.UPDATE_RENDER_COMPONENT: {
      const { componentName, filePath } = action;
      statements.componentName = componentName;
      statements.componentPath = filePath;
      return {
        ...state,
        statements,
      };
    }

    case actionTypes.ADD_PROP: {
      const { statementId } = action;
      const propId = `prop${state.propId}`;
      const { byId } = statements;
      let updatedPropId = state.propId;

      return {
        ...state,
        propId: ++updatedPropId,
        statements: {
          ...statements,
          byId: {
            ...byId,
            [statementId]: {
              ...statements.byId[statementId],
              props: [...statements.byId[statementId].props, createProp(propId, statementId)],
            },
          },
        },
      };
    }
    case actionTypes.DELETE_PROP: {
      const { id, statementId } = action;
      const props = statements.byId[statementId].props.filter((prop: Prop) => prop.id !== id);
      return {
        ...state,
        statements: {
          ...statements,
          byId: {
            ...statements.byId,
            [statementId]: {
              ...statements.byId[statementId],
              props,
            },
          },
        },
      };
    }
    case actionTypes.UPDATE_PROP: {
      const { id, statementId, propKey, propValue } = action;
      const updatedProps = [...statements.byId[statementId].props];

      updatedProps.forEach((prop) => {
        if (prop.id === id) {
          prop.propKey = propKey;
          prop.propValue = propValue;
        }
      });

      return {
        ...state,
        statements: {
          ...statements,
          byId: {
            ...statements.byId,
            [statementId]: {
              ...statements.byId[statementId],
              props: updatedProps,
            },
          },
        },
      };
    }

    case actionTypes.CREATE_NEW_TEST: {
      return {
        ...state,
        describeBlocks: {
          byId: {},
          allIds: [],
        },
        itStatements: {
          byId: {},
          allIds: {},
        },
        statements: {
          byId: {},
          allIds: [],
        },
      };
    }
    case actionTypes.OPEN_INFO_MODAL: {
      return {
        ...state,
        modalOpen: true,
      };
    }
    case actionTypes.CLOSE_INFO_MODAL: {
      return {
        ...state,
        modalOpen: false,
      };
    }
    case actionTypes.REPLACE_TEST: {
      return action.testState;
    }
    default:
      return state;
  }
};

// here we are using useContext to create the React state to be used in other files
const dispatchToReactTestCase = () => null;
const reactTestCaseArr: [ReactTestCaseTypes, (action: Action) => void] = [reactTestCaseState, dispatchToReactTestCase]
export const ReactTestCaseContext = createContext(reactTestCaseArr);