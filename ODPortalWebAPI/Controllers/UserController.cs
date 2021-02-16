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
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private readonly UserManager _userManager;
        public UserController(ILogger<UserController> logger)
        {
            _logger = logger;
            _userManager = new UserManager();
        }

        [HttpPost]
        public IActionResult Auth(Credentials credentials)
        {
            var data = _userManager.Auth(credentials);
            var result = new RequestResult<GetUserLoginObject>
            {
                Data = data,
                Message = "Success",
                Success = true
            };
            return Ok(result);
        }

        //[HttpGet]
        ////[Route("api/Auth")]
        //public IActionResult Authenticate()
        //{
        //    var rng = new Random();
        //    var list = Enumerable.Range(1, 5).Select(index => new WeatherForecast
        //    {
        //        Date = DateTime.Now.AddDays(index),
        //        TemperatureC = rng.Next(-20, 55)
        //    }).ToList();
        //    return Ok(list);
        //}
    }
}
