﻿using Microsoft.AspNetCore.Http;
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
    [ApiController]
    [Route("[controller]")]
    public class ActivityController : ControllerBase
    {
        private readonly ActivityCodeData _activityCodeData;
        private readonly ILogger<ActivityController> _logger;
        public ActivityController(ILogger<ActivityController> logger)
        {
            _logger = logger;
            _activityCodeData = new ActivityCodeData();
        }

        [HttpGet]
        [Route("GetAllActivity")]
        public IActionResult GetActivity()
        {
            var res = new RequestResult<List<AllActivityCode>>()
            {
                Data = _activityCodeData.GetAllActivity(),
                Message = "Success",
                Success = true
            };
            return Ok(res);
        }
    }
}
