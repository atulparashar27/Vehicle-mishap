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
    public class UserProfileController : ControllerBase
    {
        private readonly ILogger<UserProfileController> _logger;
        private readonly UserProfileManager _userProfileManager;
        public UserProfileController(ILogger<UserProfileController> logger)
        {
            _logger = logger;
            _userProfileManager = new UserProfileManager();
        }

        [HttpGet]
        [Route("GetProfileData")]
        public IActionResult GetProfileData(string uidNo, string rollNo)
        {
            var data = _userProfileManager.GetProfileData(uidNo, rollNo);
            var result = new RequestResult<UserProfileModal>
            {
                Data = data,
                Message = "Success",
                Success = true
            };
            return Ok(result);
        }
    }
}
