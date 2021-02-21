using ODPortalWebDL.DataAccess;
using ODPortalWebDL.DTO;
using ODPortalWebDL.DTO.ExceptionModal;
using System;
using System.Collections.Generic;
using System.Text;

namespace ODPortalWebDL.Manager
{
    public class UserRolesManager
    {
        private readonly UserRolesDataAccess _userRolesDataAccess;
        //private readonly ILogger _logger;
        public UserRolesManager()
        {
            //_logger = logger;
            _userRolesDataAccess = new UserRolesDataAccess();
        }
        public List<UserRolesModal> GetUserRolesData()
        {
            return _userRolesDataAccess.GetUserRolesData();
        }
        public List<UserRolesModal> GetUserRoles(string userName)
        {
            return _userRolesDataAccess.GetUserRoles(userName);
        }

        public bool AssignUnassignRoles(UpdateRolesModal updateRolesModal, string action)
        {
            if (action.ToLower().Trim() == "add")
            {
                return _userRolesDataAccess.AssignRoles(updateRolesModal, action);
            }
            if (action.ToLower().Trim() == "delete")
            {
                return _userRolesDataAccess.UnassignRoles(updateRolesModal, action);
            }
            throw new CustomException("Invalid Action");
        }

        public bool ManageRoles(UserRolesModal userRolesModal, string action)
        {
            if (action.ToLower().Trim() == "add")
            {
                return _userRolesDataAccess.AddNewRoles(userRolesModal);
            }

            if (action.ToLower().Trim() == "edit")
            {
                return _userRolesDataAccess.UpdateRoles(userRolesModal);
            }
            if (action.ToLower().Trim() == "delete")
            {
                return _userRolesDataAccess.DeleteRoles(userRolesModal);
            }
            throw new CustomException("Invalid Action");
        }
    }
}
