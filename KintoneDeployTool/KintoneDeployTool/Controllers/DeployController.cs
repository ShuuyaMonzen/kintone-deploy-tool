using KintoneDeployTool.ViewModels;
using KintoneDeployTool.WorkerServices;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Threading.Tasks;

namespace KintoneDeployTool.Controllers
{
    public class DeployController : BaseController<DeployWorkerService>
    {
        private readonly IWebHostEnvironment _hostingEnvironment;
        public DeployController(
            IHttpContextAccessor httpContextAccessor,
            DeployWorkerService service,
            IWebHostEnvironment hostingEnvironment
            ) : base(httpContextAccessor, service)
        {
            _hostingEnvironment = hostingEnvironment;
        }

        public async Task<IActionResult> Index(DeployViewModel vm)
        {
            if (!ModelState.IsValid)
            {
                return View("Index", vm);
            }

            vm = await Service.InitViewModel(vm);
            return View("Index", vm);
        }

        public async Task<IActionResult> GetBackup(DeployViewModel vm)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await Service.GetBackup(vm);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return Ok();
        }

        public async Task<IActionResult> RestoreBackup(DeployViewModel vm, IFormFile postedFile)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await Service.Restore(vm, postedFile, Directory.GetCurrentDirectory());
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return Ok(vm);
        }

        public async Task<IActionResult> AutoDeploy(DeployViewModel vm)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await Service.AutoDeploy(vm);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return Ok();
        }

        public async Task<IActionResult> GetConfirmMessage(DeployViewModel vm)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var checkResult = await Service.GetConfirmMessage(vm);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return Ok(checkResult);
        }


        public async Task<IActionResult> FormDeploy(DeployViewModel vm)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await Service.FormDeploy(vm);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return Ok();
        }

        public async Task<IActionResult> ListViewDeploy(DeployViewModel vm)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await Service.ListViewDeploy(vm);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return Ok();
        }

        public async Task<IActionResult> GraphDeploy(DeployViewModel vm)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await Service.GraphDeploy(vm);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return Ok();
        }

        public async Task<IActionResult> GeneralSettingDeploy(DeployViewModel vm)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await Service.GeneralSettingDeploy(vm);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return Ok();
        }

        public async Task<IActionResult> ProcessDeploy(DeployViewModel vm)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await Service.ProcessDeploy(vm);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return Ok();
        }

        public async Task<IActionResult> AppNotificationDeploy(DeployViewModel vm)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await Service.AppNotificationDeploy(vm);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return Ok();
        }

        public async Task<IActionResult> RecordNotificationDeploy(DeployViewModel vm)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await Service.RecordNotificationDeploy(vm);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return Ok();
        }

        public async Task<IActionResult> ReminderNotificationDeploy(DeployViewModel vm)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await Service.ReminderNotificationDeploy(vm);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return Ok();
        }

        public async Task<IActionResult> CustomizeFilesDeploy(DeployViewModel vm)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await Service.CustomizeFilesDeploy(vm);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return Ok();
        }

        public async Task<IActionResult> AppActionDeploy(DeployViewModel vm)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await Service.AppActionDeploy(vm);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return Ok();
        }

    }
}
