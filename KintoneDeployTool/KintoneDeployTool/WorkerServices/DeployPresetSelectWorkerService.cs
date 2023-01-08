using KintoneDeployTool.DataAccess.Repository;
using KintoneDeployTool.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Threading.Tasks;

namespace KintoneDeployTool.WorkerServices
{
    public class DeployPresetSelectWorkerService : BaseWorkerService
    {
        public DeployPresetRepository DeployPresetRepository { get; set; }

        public DeployPresetSelectWorkerService(DeployPresetRepository deployPresetRepository)
        {
            DeployPresetRepository = deployPresetRepository;
        }

        public async Task<DeployPresetSelectViewModel> GetInitViewModel()
        {
            var vm = new DeployPresetSelectViewModel();

            var deployPresets = await DeployPresetRepository.GetAllTrnDeployPresets();
            deployPresets.ForEach(x =>
            {
                vm.DeployPresetsSelectList.Add(new SelectListItem(x.PresetName, x.MstDeployPresetId.ToString(), false));
            });
            return vm;
        }
    }
}
