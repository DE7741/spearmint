import { EndpointStatements } from '../../utils/endpointTypes';

export const actionTypes = {
  UPDATE_ENDPOINT_STATEMENTS_ORDER: 'UPDATE_ENDPOINT_STATEMENTS_ORDER',
  // UPDATE_SERVER_FILE_PATH: 'UPDATE_SERVER_FILE_PATH',
  TOGGLE_ENDPOINT: 'TOGGLE_ENDPOINT',
  CREATE_NEW_ENDPOINT_TEST: 'CREATE_NEW_ENDPOINT_TEST',
  UPDATE_SERVER_FILEPATH: 'UPDATE_SERVER_FILEPATH',
  UPDATE_STATEMENTS_ORDER: 'UPDATE_STATEMENTS_ORDER',
  ADD_ENDPOINT: 'ADD_ENDPOINT',
  DELETE_ENDPOINT: 'DELETE_ENDPOINT',
  UPDATE_ENDPOINT: 'UPDATE_ENDPOINT',
  OPEN_INFO_MODAL: 'OPEN_INFO_MODAL',
  CLOSE_INFO_MODAL: 'CLOSE_INFO_MODAL',
};

// Never used
export const updateEndpointStatementsOrder = (draggableStatements: string) => ({
  type: actionTypes.UPDATE_ENDPOINT_STATEMENTS_ORDER,
  draggableStatements,
});

export const toggleEndpoint = () => ({
  type: actionTypes.TOGGLE_ENDPOINT,
});

export const createNewEndpointTest = () => ({
  type: actionTypes.CREATE_NEW_ENDPOINT_TEST,
});

export const updateServerFilePath = (serverFileName: string, serverFilePath: string) => ({
  type: actionTypes.UPDATE_SERVER_FILEPATH,
  serverFileName,
  serverFilePath,
});

export const addEndpoint = () => ({
  type: actionTypes.ADD_ENDPOINT,
});

export const deleteEndpoint = (id: number) => ({
  type: actionTypes.DELETE_ENDPOINT,
  id,
});

export const updateEndpoint = (endpoint: object) => ({
  ...endpoint,
  type: actionTypes.UPDATE_ENDPOINT,
});

export const updateStatementsOrder = (draggableStatements: Array<EndpointStatements>) => {
  return {
    type: actionTypes.UPDATE_STATEMENTS_ORDER,
    draggableStatements,
  };
};

export const openInfoModal = () => {
  return { type: actionTypes.OPEN_INFO_MODAL };
};

export const closeInfoModal = () => {
  return { type: actionTypes.CLOSE_INFO_MODAL };
};
