using KintoneDeployTool.WorkerServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace KintoneDeployTool.Controllers
{
    public class DeployPresetSelectController : BaseController<DeployPresetSelectWorkerService>
    {
        public DeployPresetSelectController(
            IHttpContextAccessor httpContextAccessor,
            DeployPresetSelectWorkerService service
            ) : base(httpContextAccessor, service)
        {
        }

        public async Task<IActionResult> Index()
        {
            var vm = await Service.GetInitViewModel();
            return View("Index", vm);
        }

    }
}
