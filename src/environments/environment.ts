const baseURL = 'http://' + localStorage.getItem("SERVER_PATH") + '/comp3005l/wolverine/stock-simulation/'

export const environment = {
  production: false,

  //Service error waiting time in ms
  SERVICE_ERROR_WAIT: 15000,

  //Authentication
  SIGN_UP: baseURL + 'authentication/sign-up',
  SIGN_IN: baseURL + 'authentication/sign-in',
  MANAGE_ACCOUNT_NAME: baseURL + 'authentication/manage-account-name',
  MANAGE_ACCOUNT_PASSWORD: baseURL + 'authentication/manage-account-pass',

  //Menu
  CREATE_GAME: baseURL + 'gameplay/create',
  GET_GAME_LIST: baseURL + 'gameplay/list',
  JOIN_GAME: baseURL + 'gameplay/join',

  //Game Play
  REQUEST_STREAM: baseURL + 'gameplay/stream',
  START_GAME: baseURL + 'gameplay/start',
  PURCHASE_STOCK: baseURL + 'gameplay/purchase',

  //Game Stream Response Codes
  WAITING_FOR_PLAYERS: '0x7001',
  SECTOR_DATA: '0x7002',
  PURCHASE_STOCK_STREAM: '0x7003',
  GAME_TURN: '0x7005',

  MIN_PLAYER_COUNT: 1,

  //Response codes
  USER_ALREADY_EXIT: '0x8000',
  ERROR: '0x9000',
  SUCCESS: '0x7000'
};