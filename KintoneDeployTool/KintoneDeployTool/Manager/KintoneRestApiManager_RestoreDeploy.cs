using KintoneDeployTool.Utils;
using static KintoneDeployTool.DataAccess.Const.CodeConst;
using System.Collections.Generic;
using System.IO;
using System;
using KintoneDeployTool.DataAccess.DomainModel;
using System.Linq;
using System.Threading.Tasks;

namespace KintoneDeployTool.Manager
{
    public partial class KintoneRestApiManager
    {
        public static async Task<string> Restore(MstDeployPreset mstDeployPreset, string restoreDirectoryPath)
        {
            List<string> errorList = new List<string>();
            List<string> errorMsgList = new List<string>();
            foreach (var mstDeployFromToInfo in mstDeployPreset.MstDeployFromToInfos)
            {
                var baseDirectoryPath = Path.Combine(restoreDirectoryPath, mstDeployFromToInfo.DeployToMstKintoneApp.AppId.ToString());
                var param = new RequestParam
                {
                    MstDeployFromToInfo = mstDeployFromToInfo,
                    SiteKind = SiteKindEnum.DeployTo,
                    JsonKind = KintoneJsonKind.Deploy
                };

                //一時削除
                try
                {
                    ProcessDeleteDeploy(mstDeployFromToInfo);
                    ListViewDeleteDeploy(mstDeployFromToInfo);
                    GraphDeleteDeploy(mstDeployFromToInfo);
                    AppNotificationDeleteDeploy(mstDeployFromToInfo);
                    RecordNotificationDeleteDeploy(mstDeployFromToInfo);
                    ReminderNotificationDeleteDeploy(mstDeployFromToInfo);
                    FieldPermissionDeleteDeploy(mstDeployFromToInfo);
                    RecordPermissionDeleteDeploy(mstDeployFromToInfo);
                    AppActionDeleteDeploy(mstDeployFromToInfo);
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
                    param.JsonKind = KintoneJsonKind.CustomizeFile;
                    UploadCustomizeFiles(param, baseDirectoryPath);
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
                    param.JsonKind = KintoneJsonKind.Setting;
                    GeneralSettingDeploy(mstDeployFromToInfo, ReadBackupJsonStr(baseDirectoryPath, param));
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
            }

            foreach (var mstDeployFromToInfo in mstDeployPreset.MstDeployFromToInfos)
            {
                var baseDirectoryPath = Path.Combine(restoreDirectoryPath, mstDeployFromToInfo.DeployToMstKintoneApp.AppId.ToString());
                var param = new RequestParam
                {
                    MstDeployFromToInfo = mstDeployFromToInfo,
                    SiteKind = SiteKindEnum.DeployTo,
                    JsonKind = KintoneJsonKind.Deploy
                };

                //フィールド
                try
                {
                    param.JsonKind = KintoneJsonKind.PartsList;
                    await FormPartsDeploy(mstDeployFromToInfo, ReadBackupJsonStr(baseDirectoryPath, param));
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
                    errorList.Add("フィールド");
                }

                //プロセス管理
                try
                {
                    param.JsonKind = KintoneJsonKind.ProcessKanri;
                    await ProcessDeploy(mstDeployFromToInfo, ReadBackupJsonStr(baseDirectoryPath, param));
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

                //一覧設定
                try
                {
                    param.JsonKind = KintoneJsonKind.ListViews;
                    ListViewDeploy(mstDeployFromToInfo, ReadBackupJsonStr(baseDirectoryPath, param));
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

                //グラフ設定
                try
                {
                    param.JsonKind = KintoneJsonKind.Graph;
                    GraphDeploy(mstDeployFromToInfo, ReadBackupJsonStr(baseDirectoryPath, param));
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

                //フィールドレイアウト
                try
                {
                    param.JsonKind = KintoneJsonKind.PartsLayout;
                    await FormLayoutDeploy(mstDeployFromToInfo, ReadBackupJsonStr(baseDirectoryPath, param));
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
                    errorList.Add("フィールドレイアウト");
                }

                //通知設定
                try
                {
                    param.JsonKind = KintoneJsonKind.AppNotification;
                    AppNotificationDeploy(mstDeployFromToInfo, ReadBackupJsonStr(baseDirectoryPath, param));
                    param.JsonKind = KintoneJsonKind.RecordNotification;
                    RecordNotificationDeploy(mstDeployFromToInfo, ReadBackupJsonStr(baseDirectoryPath, param));
                    param.JsonKind = KintoneJsonKind.ReminderNotification;
                    ReminderNotificationDeploy(mstDeployFromToInfo, ReadBackupJsonStr(baseDirectoryPath, param));
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
                    errorList.Add("通知設定");
                }

                //アクセス権設定
                try
                {
                    param.JsonKind = KintoneJsonKind.AppPermission;
                    AppPermissionDeploy(mstDeployFromToInfo, ReadBackupJsonStr(baseDirectoryPath, param));
                    param.JsonKind = KintoneJsonKind.RecordPermission;
                    RecordPermissionDeploy(mstDeployFromToInfo, ReadBackupJsonStr(baseDirectoryPath, param));
                    param.JsonKind = KintoneJsonKind.FieldPermission;
                    FieldPermissionDeploy(mstDeployFromToInfo, ReadBackupJsonStr(baseDirectoryPath, param));
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
                    errorList.Add("通知設定");
                }

                //アプリアクション
                try
                {
                    param.JsonKind = KintoneJsonKind.AppAction;
                    AppActionDeploy(mstDeployFromToInfo, ReadBackupJsonStr(baseDirectoryPath, param));
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
                    errorList.Add("アプリアクション");
                }
            }

            var errorMsg = "";
            foreach (var mstDeployFromToInfo in mstDeployPreset.MstDeployFromToInfos)
            {

                if (errorList.Any())
                {
                    errorMsg += "\r\n以下の復元に失敗しました。バックアップフォルダを確認してください。";
                    for (var i = 0; i < errorList.Count; i++)
                    {
                        var error = errorList[i];
                        errorMsg += error + "\r\n";
                        errorMsg += errorMsgList[i] + "\r\n";
                    }
                }
                else
                {
                    errorMsg += "バックアップからの復元を正常に完了しました。(適用は手動にて実施してください)\r\n";
                    errorMsg += "レコードの復元はされていません。レコードのバックアップファイルはrecord.csvです。\r\n";
                    return errorMsg;
                }
            }

            if (!String.IsNullOrEmpty(errorMsg))
            {
                throw new Exception(errorMsg);
            }

            return null;
        }

    }
}
