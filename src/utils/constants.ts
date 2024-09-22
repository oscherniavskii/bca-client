export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES = '/api/auth';
export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;
export const GET_USER_INFO = `${AUTH_ROUTES}/user`;
export const UPDATE_PROFILE = `${AUTH_ROUTES}/update-profile`;
export const ADD_PROFILE_IMAGE = `${AUTH_ROUTES}/add-profile-image`;
export const REMOVE_PROFILE_IMAGE = `${AUTH_ROUTES}/remove-profile-image`;

export const CONTACTS_ROUTES = '/api/contacts';
export const SEARCH_CONTACTS_ROUTE = `${CONTACTS_ROUTES}/search`;
export const GET_CONTACTS_FOR_DM_ROUTE = `${CONTACTS_ROUTES}/get-contacts-for-dm`;
export const GET_ALL_CONTACTS = `${CONTACTS_ROUTES}/get-all-contacts`;

export const MESSAGES_ROUTES = '/api/messages';
export const GET_DIRECT_MESSAGES = `${MESSAGES_ROUTES}/get-direct-messages`;
export const UPLOAD_FILE_ROUTE = `${MESSAGES_ROUTES}/upload-file`;

export const CHANNELS_ROUTES = '/api/channels';
export const CHANNEL_CREATE_ROUTE = `${CHANNELS_ROUTES}/create`;
export const GET_ALL_CHANNELS_ROUTE = `${CHANNELS_ROUTES}/get-all`;
export const GET_CHANNELS_MESSAGES_ROUTE = `${CHANNELS_ROUTES}/get-messages`;
