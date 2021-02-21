export const MAIN = {
    APP: {
        API_VERSION: '1.0',
        MAIN_URL: {
            // HOST_URL: 'http://odrsa.api.server.gsawslab.net:9091/odrsa-service/', // AWS
            HOST_URL: window.location.origin + '/server/'
            // HOST_URL: 'http://localhost:63289/' // local
            // BASE_URL: window.location.origin + '/'
        },
        URLS: {
          AUTHENTICATE_USER: 'User/Authenticate',
          GET_ALL_ACTIVITY_CODE: 'Activity/GetAllActivity',
          GET_ALL_PEOPLE_DATE: 'Attendance/GetPeopleData',
          SAVE_SELECTED_RECORDS: 'Attendance/SubmitActivityAttendance',
          GET_PROFILE_DATA: 'UserProfile/GetProfileData',
          CALL_RESET_PASSWORD: 'resetPassword',
          SAVE_PERSONAL_INFO: 'updatePersonalDetails',
          SAVE_CONTACT_INFO: 'updateContactDetails',
          SAVE_QUALIFICATION_INFO: 'updateQualificationDetails',
          SAVE_COMPANY_INFO: 'updateCompanyDetails',
          GET_SAVED_ATTENDANCE: 'Attendance/GetSavedAttendance',
          GET_FAMILY_DETAILS: 'getFamilyDetails',
          SAVE_VISITORS_ATTENDANCE : 'submitVisitorsAttendance',
          CHANGE_ACTIVITY_CODES: 'Activity/ManageActivities',
          GET_ROLES_DATA: 'Roles/GetRolesData',
          CHANGE_ROLE_CODES: 'Roles/ManageRoles',
          GET_ASSIGNED_PERMISSIONS: 'Roles/GetAssignedRoles',
          SAVE_USER_PERMISSIONS: 'Roles/AssignUnassignRoles',
          GET_ALL_BRANCH_PEOPLE_ATTENDANCE: 'Reports/GetPeopleAttendance',
          GET_MENU_JSON: '/assets/json/menu.json'
        },
        CONSTANTS: {
            AG_GRID_CLS_THEME: 'ag-theme-balham',
            MSG_TYPE_INF: {
                timeOut: 4000,
                closeButton: true,
                enableHtml: true,
                toastClass: 'alert alert-info alert-with-icon',
                positionClass: 'toast-top-right'
            },
            MSG_TYPE_ERR: {
                timeOut: 4000,
                closeButton: true,
                enableHtml: true,
                toastClass: 'alert alert-danger alert-with-icon',
                positionClass: 'toast-top-right'
            },
            MSG_TYPE_SUCCESS: {
                timeOut: 4000,
                closeButton: true,
                enableHtml: true,
                toastClass: 'alert alert-success alert-with-icon',
                positionClass: 'toast-top-right'
            },
            LOCAL_STORAGE_OBJECT_NAMES: {
                // auth_token: 'authentication_token',
                user_info: 'user_profile',
                user_roles: 'user_roles',
                userCodes: 'userCodes'
            },
            ALERT_MSG_ICON: '<span data-notify="icon" class="nc-icon nc-bell-55"></span>',
            SCORE_REGEX_PATTERN: '^0*([0-9][0-9]?|100)$'
        },
        MESSAGES: {
          // Message constants for error and services
          UNAUTH_ERR: 'Invalid Login details entered.',
          SERVICE_ERR: 'Unable to connect the server. Please try again.',
          NOT_FOUND_ERR: 'Oops!! Something went wrong. Please contact administrator.',
          LOGIN_ERR_CODE_401 : 'You are unauthorised. Please try to login again.',
          ERR_CODE_500 : 'Something went wrong. Please contact administrator.'
        },
        // Other constants for application
        ALERT_TIMEOUT: 5000
    }
};
