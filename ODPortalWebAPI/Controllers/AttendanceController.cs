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
    [ApiController]
    [Route("[controller]")]
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
        public IActionResult GetPeopleData(string status)
        {
            var result = new RequestResult<List<ActivityAttendanceModal>>()
            {
                Data = _attendanceManager.GetPeopleDate(status),
                Message = "Success",
                Success = true
            };
            return Ok(result);
        }

        [HttpPost]
        [Route("SubmitActivityAttendance")]
        public IActionResult SubmitActivityAttendance(SubmitActivityAttendanceModal submitActivityAttendanceModal)
        {
            var result = new RequestResult<bool>()
            {
                Data = _attendanceManager.SubmitActivityAttendance(submitActivityAttendanceModal),
                Message = "Success",
                Success = true
            };
            return Ok(result);
        }

        [HttpGet]
        [Route("GetSavedAttendance")]
        public IActionResult GetSavedAttendance(string actCode, DateTime actDate)
        {
            var result = new RequestResult<SavedAttendanceModal>()
            {
                Data = _attendanceManager.GetSavedAttendance(actCode, actDate),
                Message = "Success",
                Success = true
            };
            return Ok(result);
        }

        [HttpPost]
        [Route("DeleteSavedAttendance")]
        public IActionResult DeleteSavedAttendance(SubmitActivityAttendanceModal deleteSavedAttendance)
        {
            var result = new RequestResult<bool>()
            {
                Data = _attendanceManager.DeleteSavedAttendance(deleteSavedAttendance),
                Message = "Success",
                Success = true
            };
            return Ok(result);
        }
    }
}
