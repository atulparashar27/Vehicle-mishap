using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ODPortalDL.DTO;
using ODPortalWebDL.DTO;
using ODPortalWebDL.Manager;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ODPortalWebAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        private readonly ILogger<RolesController> _logger;
        private readonly UserRolesManager _rolesManager;
        public RolesController(ILogger<RolesController> logger)
        {
            _logger = logger;
            _rolesManager = new UserRolesManager();
        }

        [HttpGet]
        [Route("GetRolesData")]
        public IActionResult GetUserRolesData()
        {
            var result = new RequestResult<List<UserRolesModal>>()
            {
                Data = _rolesManager.GetUserRolesData(),
                Message = "Success",
                Success = true
            };
            return Ok(result);
        }


        [HttpPost]
        [Route("ManageRoles")]
        public IActionResult ManageRoles(UserRolesModal userRolesModal, string action)
        {
            var result = new RequestResult<bool>()
            {
                Data = _rolesManager.ManageRoles(userRolesModal, action),
                Message = "Success",
                Success = true
            };
            return Ok(result);
        }

        [HttpGet]
        [Route("GetAssignedRoles")]
        public IActionResult GetAssignedRoles(string uidNo)
        {
            var result = new RequestResult<List<UserRolesModal>>()
            {
                Data = _rolesManager.GetUserRoles(uidNo),
                Message = "Success",
                Success = true
            };
            return Ok(result);
        }


        [HttpPost]
        [Route("AssignUnassignRoles")]
        public IActionResult AssignUnassignRoles(UpdateRolesModal updateRolesModal, string action)
        {
            var result = new RequestResult<bool>()
            {
                Data = _rolesManager.AssignUnassignRoles(updateRolesModal, action),
                Message = "Success",
                Success = true
            };
            return Ok(result);
        }
    }
}
