using KintoneDeployTool.Common;
using KintoneDeployTool.ViewModels;
using KintoneDeployTool.Extentions;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Text;
using System.Xml.Serialization;
using KintoneDeployTool.Utils;
using System;
using KintoneDeployTool.DataAccess.Repository;
using KintoneDeployTool.Manager;
using System.Threading.Tasks;
using System.Collections.Generic;
using KintoneDeployTool.DataAccess.Const;
using System.IO.Compression;
using static KintoneDeployTool.Manager.KintoneRestApiManager;
using NuGet.Packaging;

namespace KintoneDeployTool.WorkerServices
{
    public class DeployWorkerService : BaseWorkerService
    {
        public DeployPresetRepository DeployPresetRepository { get; set; }

        public DeployWorkerService(DeployPresetRepository deployPresetRepository)
        {
            DeployPresetRepository = deployPresetRepository;
        }

        public async Task<DeployViewModel> InitViewModel(DeployViewModel vm)
        {
            try
            {
                var trnDeployPreset = await DeployPresetRepository.GetTrnDeployPreset(vm.TrnDeployPresetId.Value);
                vm.PresetName = trnDeployPreset.PresetName;
            }
            catch (Exception e)
            {
                if (e is AggregateException ex)
                {
                    vm.LogMessage = ex.InnerException.Message;
                    ModelState.AddModelError(string.Empty, ex.InnerException.Message);
                }
                else
                {
                    vm.LogMessage = e.Message;
                    ModelState.AddModelError(string.Empty, e.Message);
                }
            }
            return vm;
        }

        public async Task<string> GetBackup(DeployViewModel vm)
        {
            try
            {
                var trnDeployPreset = await DeployPresetRepository.GetTrnDeployPreset(vm.TrnDeployPresetId.Value);
                var zipFilePath = KintoneRestApiManager.GetBackupJsons(trnDeployPreset);
                return zipFilePath;
            }
            catch (Exception e)
            {
                if (e is AggregateException ex)
                {
                    vm.LogMessage = ex.InnerException.Message;
                    ModelState.AddModelError(string.Empty, ex.InnerException.Message);
                }
                else
                {
                    vm.LogMessage = e.Message;
                    ModelState.AddModelError(string.Empty, e.Message);
                }
            }
            return null;
        }

        public async Task<CheckResult> GetConfirmMessage(DeployViewModel vm)
        {
            try
            {
                var trnDeployPreset = await DeployPresetRepository.GetTrnDeployPreset(vm.TrnDeployPresetId.Value);
                var result = await KintoneRestApiManager.GetComfirmMessage(vm, trnDeployPreset);
                return result;
            }
            catch (Exception e)
            {
                if (e is AggregateException ex)
                {
                    vm.LogMessage = ex.InnerException.Message;
                    ModelState.AddModelError(string.Empty, ex.InnerException.Message);
                }
                else
                {
                    vm.LogMessage = e.Message;
                    ModelState.AddModelError(string.Empty, e.Message);
                }
            }
            return null;
        }

        public async Task<DeployViewModel> FormDeploy(DeployViewModel vm)
        {
            try
            {
                var trnDeployPreset = await DeployPresetRepository.GetTrnDeployPreset(vm.TrnDeployPresetId.Value);
                await KintoneRestApiManager.FormPartsDeployAllApp(trnDeployPreset);
                await KintoneRestApiManager.FormLayoutDeployAllApp(trnDeployPreset);
            }
            catch (Exception e)
            {
                if (e is AggregateException ex)
                {
                    vm.LogMessage = ex.InnerException.Message;
                    ModelState.AddModelError(string.Empty, ex.InnerException.Message);
                }
                else
                {
                    vm.LogMessage = e.Message;
                    ModelState.AddModelError(string.Empty, e.Message);
                }
            }
            return vm;
        }

        public async Task<DeployViewModel> ListViewDeploy(DeployViewModel vm)
        {
            try
            {
                var trnDeployPreset = await DeployPresetRepository.GetTrnDeployPreset(vm.TrnDeployPresetId.Value);
                KintoneRestApiManager.ListViewDeployAllApp(trnDeployPreset);
            }
            catch (Exception e)
            {
                if (e is AggregateException ex)
                {
                    vm.LogMessage = ex.InnerException.Message;
                    ModelState.AddModelError(string.Empty, ex.InnerException.Message);
                }
                else
                {
                    vm.LogMessage = e.Message;
                    ModelState.AddModelError(string.Empty, e.Message);
                }
            }
            return vm;
        }

        public async Task<DeployViewModel> GraphDeploy(DeployViewModel vm)
        {
            try
            {
                var trnDeployPreset = await DeployPresetRepository.GetTrnDeployPreset(vm.TrnDeployPresetId.Value);
                KintoneRestApiManager.GraphDeployAllApp(trnDeployPreset);
            }
            catch (Exception e)
            {
                if (e is AggregateException ex)
                {
                    vm.LogMessage = ex.InnerException.Message;
                    ModelState.AddModelError(string.Empty, ex.InnerException.Message);
                }
                else
                {
                    vm.LogMessage = e.Message;
                    ModelState.AddModelError(string.Empty, e.Message);
                }
            }
            return vm;
        }

        public async Task<DeployViewModel> GeneralSettingDeploy(DeployViewModel vm)
        {
            try
            {
                var trnDeployPreset = await DeployPresetRepository.GetTrnDeployPreset(vm.TrnDeployPresetId.Value);
                KintoneRestApiManager.GeneralSettingDeployAllApp(trnDeployPreset);
            }
            catch (Exception e)
            {
                if (e is AggregateException ex)
                {
                    vm.LogMessage = ex.InnerException.Message;
                    ModelState.AddModelError(string.Empty, ex.InnerException.Message);
                }
                else
                {
                    vm.LogMessage = e.Message;
                    ModelState.AddModelError(string.Empty, e.Message);
                }
            }
            return vm;
        }

        public async Task<DeployViewModel> ProcessDeploy(DeployViewModel vm)
        {
            try
            {
                var trnDeployPreset = await DeployPresetRepository.GetTrnDeployPreset(vm.TrnDeployPresetId.Value);
                await KintoneRestApiManager.ProcessDeployAllApp(trnDeployPreset);
            }
            catch (Exception e)
            {
                if (e is AggregateException ex)
                {
                    vm.LogMessage = ex.InnerException.Message;
                    ModelState.AddModelError(string.Empty, ex.InnerException.Message);
                }
                else
                {
                    vm.LogMessage = e.Message;
                    ModelState.AddModelError(string.Empty, e.Message);
                }
            }
            return vm;
        }

        public async Task<DeployViewModel> AppNotificationDeploy(DeployViewModel vm)
        {
            try
            {
                var trnDeployPreset = await DeployPresetRepository.GetTrnDeployPreset(vm.TrnDeployPresetId.Value);
                KintoneRestApiManager.AppNotificationDeployAllApp(trnDeployPreset);
            }
            catch (Exception e)
            {
                if (e is AggregateException ex)
                {
                    vm.LogMessage = ex.InnerException.Message;
                    ModelState.AddModelError(string.Empty, ex.InnerException.Message);
                }
                else
                {
                    vm.LogMessage = e.Message;
                    ModelState.AddModelError(string.Empty, e.Message);
                }
            }
            return vm;
        }

        public async Task<DeployViewModel> RecordNotificationDeploy(DeployViewModel vm)
        {
            try
            {
                var trnDeployPreset = await DeployPresetRepository.GetTrnDeployPreset(vm.TrnDeployPresetId.Value);
                KintoneRestApiManager.RecordNotificationDeployAllApp(trnDeployPreset);
            }
            catch (Exception e)
            {
                if (e is AggregateException ex)
                {
                    vm.LogMessage = ex.InnerException.Message;
                    ModelState.AddModelError(string.Empty, ex.InnerException.Message);
                }
                else
                {
                    vm.LogMessage = e.Message;
                    ModelState.AddModelError(string.Empty, e.Message);
                }
            }
            return vm;
        }

        public async Task<DeployViewModel> ReminderNotificationDeploy(DeployViewModel vm)
        {
            try
            {
                var trnDeployPreset = await DeployPresetRepository.GetTrnDeployPreset(vm.TrnDeployPresetId.Value);
                KintoneRestApiManager.ReminderNotificationDeployAllApp(trnDeployPreset);
            }
            catch (Exception e)
            {
                if (e is AggregateException ex)
                {
                    vm.LogMessage = ex.InnerException.Message;
                    ModelState.AddModelError(string.Empty, ex.InnerException.Message);
                }
                else
                {
                    vm.LogMessage = e.Message;
                    ModelState.AddModelError(string.Empty, e.Message);
                }
            }
            return vm;
        }

        public async Task<DeployViewModel> CustomizeFilesDeploy(DeployViewModel vm)
        {
            try
            {
                var trnDeployPreset = await DeployPresetRepository.GetTrnDeployPreset(vm.TrnDeployPresetId.Value);
                KintoneRestApiManager.CustomizeFilesDeployAllApp(trnDeployPreset);
            }
            catch (Exception e)
            {
                if (e is AggregateException ex)
                {
                    vm.LogMessage = ex.InnerException.Message;
                    ModelState.AddModelError(string.Empty, ex.InnerException.Message);
                }
                else
                {
                    vm.LogMessage = e.Message;
                    ModelState.AddModelError(string.Empty, e.Message);
                }
            }
            return vm;
        }

        public async Task<DeployViewModel> AppActionDeploy(DeployViewModel vm)
        {
            try
            {
                var trnDeployPreset = await DeployPresetRepository.GetTrnDeployPreset(vm.TrnDeployPresetId.Value);
                KintoneRestApiManager.AppActionDeployAllApp(trnDeployPreset);
            }
            catch (Exception e)
            {
                if (e is AggregateException ex)
                {
                    vm.LogMessage = ex.InnerException.Message;
                    ModelState.AddModelError(string.Empty, ex.InnerException.Message);
                }
                else
                {
                    vm.LogMessage = e.Message;
                    ModelState.AddModelError(string.Empty, e.Message);
                }
            }
            return vm;
        }

        public async Task<DeployViewModel> Restore(DeployViewModel vm, IFormFile postedFile, string contentRootPath)
        {
            try
            {
                var trnDeployPreset = await DeployPresetRepository.GetTrnDeployPreset(vm.TrnDeployPresetId.Value);
                KintoneRestApiManager.GetBackupJsons(trnDeployPreset);

                // アップロードされたファイル名を取得。ブラウザが IE 
                // の場合 postedFile.FileName はクライアント側でのフ
                // ルパスになることがあるので Path.GetFileName を使う
                string fileName = Path.GetFileName(postedFile.FileName);
                string fileNameWithoutExtension = Path.GetFileNameWithoutExtension(postedFile.FileName);
                string filePath = Path.Combine(contentRootPath, "UploadedFiles", fileName);
                string unzipDirectoryPath = Path.Combine(contentRootPath, "UploadedFiles", fileNameWithoutExtension);
                if (!Directory.Exists(Path.Combine(contentRootPath, "UploadedFiles")))
                {
                    Directory.CreateDirectory(Path.Combine(contentRootPath, "UploadedFiles"));
                }

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await postedFile.CopyToAsync(stream);
                }

                ZipFile.ExtractToDirectory(filePath, unzipDirectoryPath, true);
                vm.LogMessage = await KintoneRestApiManager.Restore(trnDeployPreset, unzipDirectoryPath);

                File.Delete(filePath);
                Directory.Delete(unzipDirectoryPath, true);

            }
            catch (Exception e)
            {
                if (e is AggregateException ex)
                {
                    vm.LogMessage = ex.InnerException.Message;
                    ModelState.AddModelError(string.Empty, ex.InnerException.Message);
                }
                else
                {
                    vm.LogMessage = e.Message;
                    ModelState.AddModelError(string.Empty, e.Message);
                }
            }
            return vm;
        }

        public async Task<DeployViewModel> AutoDeploy(DeployViewModel vm)
        {
            var trnDeployPreset = await DeployPresetRepository.GetTrnDeployPreset(vm.TrnDeployPresetId.Value);

            var errorList = new List<string>();
            var errorMsgList = new List<string>();

            string tempBackupFolder = Path.Combine(Directory.GetCurrentDirectory(), "temp_backup");
            Directory.CreateDirectory(tempBackupFolder);

            //削除前にバックアップファイル取得
            try
            {
                KintoneRestApiManager.GetBackupJsons(trnDeployPreset);
            }
            catch (Exception e)
            {
                if (e is AggregateException ex)
                {
                    errorMsgList.Add(ex.InnerException.Message);
                }
                else
                {
                    errorMsgList.Add(e.Message);
                }
                errorList.Add("バックアップファイル取得");
            }

            //一時削除
            try
            {
                KintoneRestApiManager.ProcessDeleteDeployAllApp(trnDeployPreset);
                KintoneRestApiManager.ListViewDeleteDeployAllApp(trnDeployPreset);
                KintoneRestApiManager.GraphDeleteDeployAllApp(trnDeployPreset);
                KintoneRestApiManager.AppNotificationDeleteDeployAllApp(trnDeployPreset);
                KintoneRestApiManager.RecordNotificationDeleteDeployAllApp(trnDeployPreset);
                KintoneRestApiManager.ReminderNotificationDeleteDeployAllApp(trnDeployPreset);
                KintoneRestApiManager.FieldPermissionDeleteDeployAllApp(trnDeployPreset);
                KintoneRestApiManager.RecordPermissionDeleteDeployAllApp(trnDeployPreset);
                KintoneRestApiManager.AppActionDeleteDeployAllApp(trnDeployPreset);
            }
            catch (Exception e)
            {
                if (e is AggregateException ex)
                {
                    errorMsgList.Add(ex.InnerException.Message);
                }
                else
                {
                    errorMsgList.Add(e.Message);
                }
                errorList.Add("各設定の一時削除");
            }

            //カスタマイズファイル
            try
            {
                KintoneRestApiManager.CustomizeFilesDeployAllApp(trnDeployPreset);
            }
            catch (Exception e)
            {
                if (e is AggregateException ex)
                {
                    errorMsgList.Add(ex.InnerException.Message);
                }
                else
                {
                    errorMsgList.Add(e.Message);
                }
                errorList.Add("カスタマイズファイル");
            }

            //一般設定
            try
            {
                KintoneRestApiManager.GeneralSettingDeployAllApp(trnDeployPreset);
            }
            catch (Exception e)
            {
                if (e is AggregateException ex)
                {
                    errorMsgList.Add(ex.InnerException.Message);
                }
                else
                {
                    errorMsgList.Add(e.Message);
                }
                errorList.Add("一般設定");
            }

            //フィールドの追加、更新、削除のデプロイ
            try
            {
                await KintoneRestApiManager.FormPartsDeployAllApp(trnDeployPreset);
            }
            catch (Exception e)
            {
                if (e is AggregateException ex)
                {
                    errorMsgList.Add(ex.InnerException.Message);
                }
                else
                {
                    errorMsgList.Add(e.Message);
                }
                errorList.Add("フィールドの更新、削除");
            }

            //プロセス管理のデプロイ
            try
            {
                await KintoneRestApiManager.ProcessDeployAllApp(trnDeployPreset);
            }
            catch (Exception e)
            {
                if (e is AggregateException ex)
                {
                    errorMsgList.Add(ex.InnerException.Message);
                }
                else
                {
                    errorMsgList.Add(e.Message);
                }
                errorList.Add("プロセス管理");
            }

            //一覧のデプロイ
            try
            {
                KintoneRestApiManager.ListViewDeployAllApp(trnDeployPreset);
            }
            catch (Exception e)
            {
                if (e is AggregateException ex)
                {
                    errorMsgList.Add(ex.InnerException.Message);
                }
                else
                {
                    errorMsgList.Add(e.Message);
                }
                errorList.Add("一覧設定");
            }

            //グラフのデプロイ
            try
            {
                KintoneRestApiManager.GraphDeployAllApp(trnDeployPreset);
            }
            catch (Exception e)
            {
                if (e is AggregateException ex)
                {
                    errorMsgList.Add(ex.InnerException.Message);
                }
                else
                {
                    errorMsgList.Add(e.Message);
                }
                errorList.Add("グラフ設定");
            }

            //フィールドのレイアウトのデプロイ
            try
            {
                await KintoneRestApiManager.FormLayoutDeployAllApp(trnDeployPreset);
            }
            catch (Exception e)
            {
                if (e is AggregateException ex)
                {
                    errorMsgList.Add(ex.InnerException.Message);
                }
                else
                {
                    errorMsgList.Add(e.Message);
                }
                errorList.Add("フィールドのレイアウト設定");
            }

            //レコードの条件通知のデプロイ
            try
            {
                KintoneRestApiManager.RecordNotificationDeployAllApp(trnDeployPreset);
            }
            catch (Exception e)
            {
                if (e is AggregateException ex)
                {
                    errorMsgList.Add(ex.InnerException.Message);
                }
                else
                {
                    errorMsgList.Add(e.Message);
                }
                errorList.Add("レコードの条件通知設定");
            }

            //リマインダーの条件通知のデプロイ
            try
            {
                KintoneRestApiManager.ReminderNotificationDeployAllApp(trnDeployPreset);
            }
            catch (Exception e)
            {
                if (e is AggregateException ex)
                {
                    errorMsgList.Add(ex.InnerException.Message);
                }
                else
                {
                    errorMsgList.Add(e.Message);
                }
                errorList.Add("リマインダーの条件通知設定");
            }

            //一時削除した機能を復元
            foreach (var deployFromTo in trnDeployPreset.MstDeployFromToInfos)
            {
                var param = new KintoneRestApiManager.RequestParam
                {
                    MstDeployFromToInfo = deployFromTo,
                    SiteKind = CodeConst.SiteKindEnum.DeployTo
                };

                string appBackupDirectoryPath = Path.Combine(tempBackupFolder, deployFromTo.DeployToMstKintoneApp.AppId.ToString());

                try
                {

                    param.JsonKind = CodeConst.KintoneJsonKind.AppNotification;
                    KintoneRestApiManager.AppNotificationDeploy(deployFromTo, 
                        KintoneRestApiManager.ReadBackupJsonStr(appBackupDirectoryPath, param));

                    param.JsonKind = CodeConst.KintoneJsonKind.FieldPermission;
                    KintoneRestApiManager.FieldPermissionDeploy(deployFromTo,
                        KintoneRestApiManager.ReadBackupJsonStr(appBackupDirectoryPath, param));

                    param.JsonKind = CodeConst.KintoneJsonKind.RecordPermission;
                    KintoneRestApiManager.RecordPermissionDeploy(deployFromTo, 
                        KintoneRestApiManager.ReadBackupJsonStr(appBackupDirectoryPath, param));

                    param.JsonKind = CodeConst.KintoneJsonKind.AppAction;
                    KintoneRestApiManager.AppNotificationDeploy(deployFromTo,
                        KintoneRestApiManager.ReadBackupJsonStr(appBackupDirectoryPath, param));
                }
                catch (Exception e)
                {
                    if (e is AggregateException ex)
                    {
                        errorMsgList.Add(ex.InnerException.Message);
                    }
                    else
                    {
                        errorMsgList.Add(e.Message);
                    }
                    errorList.Add("各設定の復元");
                }
            }

            return vm;
        }
    }
}
