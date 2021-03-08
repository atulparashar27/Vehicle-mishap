using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ODPortalDL.DTO;
using ODPortalWebDL.Manager;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static ODPortalWebDL.DTO.MiscModal;

namespace ODPortalWebAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class MiscController : ControllerBase
    {
        private readonly ILogger<MiscController> _logger;
        private readonly MiscManager _miscManager;
        public MiscController(ILogger<MiscController> logger)
        {
            _logger = logger;
            _miscManager = new MiscManager();
        }


        [HttpGet]
        [Route("GetLocalityList")]
        public IActionResult GetLocalityList()
        {
            var result = new RequestResult<List<LocalityList>>()
            {
                Data = _miscManager.GetLocalityLists(),
                Message = "Success",
                Success = true
            };
            return Ok(result);
        }

        [HttpGet]
        [Route("GetLocalityPeopleList")]
        public IActionResult GetLocalityPeople(int localityId)
        {
            var result = new RequestResult<List<LocalityPeople>>()
            {
                Data = _miscManager.GetLocalityPeople(localityId),
                Message = "Success",
                Success = true
            };
            return Ok(result);
        }
    }
}
