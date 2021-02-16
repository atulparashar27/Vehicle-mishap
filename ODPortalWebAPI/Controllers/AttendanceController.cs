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
    [Route("api/[controller]")]
    public class AttendanceController : ControllerBase
    {
        private readonly ILogger<AttendanceController> _logger;
        private readonly AttendanceManager _attendanceManager;
        public AttendanceController(ILogger<AttendanceController> logger)
        {
            _logger = logger;
            _attendanceManager = new AttendanceManager();
        }

        [HttpGet]
        [Route("GetPeopleData")]
        public IActionResult GetPeopleDate(string status)
        {
            var result = new RequestResult<List<ActivityAttendanceModal>>()
            {
                Data = _attendanceManager.GetPeopleDate(status),
                Message = "Success",
                Success = true
            };
            return Ok(result);
        }
    }
}
