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
    public class ReportsController : ControllerBase
    {
        private ILogger<ReportsController> _logger;
        private ReportsManager _reportsManager;
        public ReportsController(ILogger<ReportsController> logger)
        {
            _logger = logger;
            _reportsManager = new ReportsManager();
        }

        [HttpPost]
        [Route("GetPeopleAttendance")]
        public IActionResult GetPeopleAttendance(BranchPeopleAttendance branchPeopleAttendance, int page)
        {
            var result = new RequestResult<BranchPeoplePaginationAttendance>()
            {
                Data = _reportsManager.GetPeopleAttendance(branchPeopleAttendance, page),
                Message = "Success",
                Success = true
            };
            return Ok(result);
        }

        [HttpPost]
        [Route("GetPeopleAttendanceSummary")]
        public IActionResult GetPeoplAttendanceSummary(BranchPeopleSummaryModel model)
        {
            var result = new RequestResult<List<BranchAttendanceSummary>>()
            {
                Data = _reportsManager.GetPeopleAttendanceSummary(model),
                Message = "Success",
                Success = true
            };
            return Ok(result);
        }
    }
}
