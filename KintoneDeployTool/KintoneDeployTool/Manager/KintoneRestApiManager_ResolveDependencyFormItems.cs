using KintoneDeployTool.DataAccess.DomainModel;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static KintoneDeployTool.DataAccess.Const.CodeConst;
using static KintoneDeployTool.Manager.KintoneRestApiManager;

namespace KintoneDeployTool.Manager
{
    public partial class KintoneRestApiManager
    {
        public class DependencyResolvedItem
        {
            /// <summary>
            /// 参照元項目(ルックアップ, 関連レコード一覧, 計算)
            /// </summary>
            public List<DependentItem> DependentItems { get; } = new List<DependentItem>();

            /// <summary>
            /// 参照元項目(ルックアップ, 関連レコード一覧)
            /// </summary>
            public List<DependentItem> DependentOnOtherAppItems { get; } = new List<DependentItem>();

            /// <summary>
            /// 参照先項目
            /// </summary>
            public List<PrecedentItem> PrecedentItems { get; } = new List<PrecedentItem>();

            public List<FormItem> GetItemsOfCanAddOrUpdate()
            {
                //追加/更新済みでない項目がない
                if (!DependentItems.Any(x => !x.AlreadyAddOrUpdated) &&
                    !PrecedentItems.Any(x => !x.AlreadyAddOrUpdated))
                {
                    return null;
                }


                var result = new List<FormItem>();

                //追加されていない通常項目
                result.AddRange(PrecedentItems.Where(x => !x.AlreadyAddOrUpdated && !x.IsDependentItem).Cast<FormItem>());

                //参照先項目がすべて処理済みの参照元項目
                result.AddRange(DependentItems.Where(x => !x.AlreadyAddOrUpdated && !x.PrecedentItems.Any(x => !x.AlreadyAddOrUpdated)).Cast<FormItem>());

                return result;
            }

            public void SetProcessedItem(int appId, string fieldCode)
            {
                var dependentItem = DependentItems.Where(x => x.AppId == appId && x.FieldCode == fieldCode).SingleOrDefault();
                if (dependentItem != null)
                {
                    dependentItem.AlreadyAddOrUpdated = true;
                }

                var precedentItem = PrecedentItems.Where(x => x.AppId == appId && x.FieldCode == fieldCode).SingleOrDefault();
                if (precedentItem != null)
                {
                    precedentItem.AlreadyAddOrUpdated = true;
                }
            }

            public void SetProcessedPrecedentItems()
            {
                foreach (var PrecedentItem in PrecedentItems)
                {
                    PrecedentItem.AlreadyAddOrUpdated = true;
                }
            }

            public class FormItem
            {
                public int AppId { get; set; }

                public string FieldCode { get; set; }

                public bool AlreadyAddOrUpdated { get; set; }

                public string SubTableFieldCode { get; set; }
            }

            /// <summary>
            /// 参照元項目
            /// </summary>
            public class DependentItem : FormItem
            {
                public List<PrecedentItem> PrecedentItems { get; } = new List<PrecedentItem>();
            }

            /// <summary>
            /// 参照先項目
            /// </summary>
            public class PrecedentItem : FormItem
            {
                public bool IsDependentItem { get; set; }

                public List<DependentItem> DependentItems { get; } = new List<DependentItem>();
            }
        }

        /// <summary>
        /// 依存性解決の処理中にてに使うクラス
        /// </summary>
        private class ProccessClassOfResolveItemDependency
        {
            public int DeployFromAppId { get; set; }
            public int DeployToAppId { get; set; }

            public string FormJsonString { get; set; }
        }


        private static async Task<DependencyResolvedItem> GetDependencyResolvedItemAsync(MstDeployPreset mstDeployPreset)
        {
            var resolvedItem = new DependencyResolvedItem();

            //key:appId, value:formJson(文字列)
            var formJsons = new List<ProccessClassOfResolveItemDependency>();

            foreach (var mstDeployFromToInfo in mstDeployPreset.MstDeployFromToInfos)
            {
                var fromParam = new RequestParam
                {
                    MstDeployFromToInfo = mstDeployFromToInfo,
                    SiteKind = SiteKindEnum.DeployFrom,
                    JsonKind = KintoneJsonKind.PartsList
                };

                var formJsonStr = await KintoneGetAsync(fromParam);
                formJsons.Add(new ProccessClassOfResolveItemDependency
                {
                    DeployFromAppId = mstDeployFromToInfo.DeployFromMstKintoneApp.AppId,
                    DeployToAppId = mstDeployFromToInfo.DeployToMstKintoneApp.AppId,
                    FormJsonString = formJsonStr
                });
            }

            //他項目に依存しないもの
            foreach (var formJson in formJsons)
            {
                var deployFromAppId = formJson.DeployFromAppId;
                var deployToAppId = formJson.DeployToAppId;
                var formJsonStr = formJson.FormJsonString;

                var allFieldCodes = GetAllFieldCodes(formJsonStr);
                var formJsonObj = (JObject)JObject.Parse(formJsonStr)["properties"];
                var fieldCodeFieldTypePairs = GetFieldCodeFieldTypePairs(formJsonStr);
                var subTableKeys = GetSubTableFieldCodes(formJsonStr);
                var fieldCodeFieldTypePairsInSubtable = GetFieldCodeFieldTypeInSubTablePairs(formJsonStr, subTableKeys);

                #region サブテーブル以外の項目(他項目に依存しないもの)
                foreach (var fieldCodeFieldTypePair in fieldCodeFieldTypePairs)
                {
                    var fieldCode = fieldCodeFieldTypePair.Key;
                    var fieldType = fieldCodeFieldTypePair.Value;
                    var val = (JObject)formJsonObj[fieldCode];
                    if ((fieldType != "REFERENCE_TABLE") ||
                        (fieldType != "CALC") ||
                        (val?["lookup"] == null))
                    {
                        resolvedItem.PrecedentItems.Add(new DependencyResolvedItem.PrecedentItem()
                        {
                            AppId = deployFromAppId,
                            SubTableFieldCode = null,
                            FieldCode = fieldCode
                        });
                    }
                }
                #endregion

                #region サブテーブルの項目(他項目に依存しないもの)
                foreach (var subtableKey in subTableKeys)
                {
                    foreach (var fieldCodeFieldTypePairInSubtable in fieldCodeFieldTypePairsInSubtable)
                    {
                        var fieldCode = fieldCodeFieldTypePairInSubtable.Key;
                        var fieldType = fieldCodeFieldTypePairInSubtable.Value;
                        var val = (JObject)formJsonObj[subtableKey]["fields"][fieldCode];
                        if ((fieldType != "REFERENCE_TABLE") ||
                            (fieldType != "CALC") ||
                            (val?["lookup"] == null))
                        {
                            resolvedItem.PrecedentItems.Add(new DependencyResolvedItem.PrecedentItem()
                            {
                                AppId = deployFromAppId,
                                SubTableFieldCode = subtableKey,
                                FieldCode = fieldCode
                            });
                        }
                    }
                }
                #endregion
            }

            foreach (var formJson in formJsons)
            {
                var deployFromAppId = formJson.DeployFromAppId;
                var deployToAppId = formJson.DeployToAppId;
                var formJsonStr = formJson.FormJsonString;

                var allFieldCodes = GetAllFieldCodes(formJsonStr);
                var formJsonObj = (JObject)JObject.Parse(formJsonStr)["properties"];
                var fieldCodeFieldTypePairs = GetFieldCodeFieldTypePairs(formJsonStr);
                var subTableKeys = GetSubTableFieldCodes(formJsonStr);
                var fieldCodeFieldTypePairsInSubtable = GetFieldCodeFieldTypeInSubTablePairs(formJsonStr, subTableKeys);

                #region 計算フィールド
                #region サブテーブル以外の項目
                foreach (var fieldCodeFieldTypePair in fieldCodeFieldTypePairs)
                {
                    var fieldCode = fieldCodeFieldTypePair.Key;
                    var fieldType = fieldCodeFieldTypePair.Value;
                    var val = (JObject)formJsonObj[fieldCode];
                    if (fieldType != "CALC")
                    {
                        continue;
                    }
                    var expression = (string)formJsonObj[fieldCode]["expression"];
                    var dependentItem = new DependencyResolvedItem.DependentItem()
                    {
                        AppId = deployFromAppId,
                        SubTableFieldCode = null,
                        FieldCode = fieldCode,
                    };

                    foreach (var tempFieldCode in allFieldCodes)
                    {
                        if (expression.Contains(tempFieldCode))
                        {
                            dependentItem.PrecedentItems.Add(
                                resolvedItem.PrecedentItems
                                .Where(x => x.AppId == deployFromAppId && x.FieldCode == tempFieldCode)
                                .Single()
                            );
                        }
                    }

                    resolvedItem.DependentItems.Add(dependentItem);
                }
                #endregion

                #region サブテーブルの項目
                foreach (var subtableKey in subTableKeys)
                {
                    foreach (var fieldCodeFieldTypePairInSubtable in fieldCodeFieldTypePairsInSubtable)
                    {
                        var fieldCode = fieldCodeFieldTypePairInSubtable.Key;
                        var fieldType = fieldCodeFieldTypePairInSubtable.Value;
                        if (fieldType != "CALC")
                        {
                            continue;
                        }
                        var expression = formJsonObj[subtableKey]["fields"][fieldCode]["expression"];

                        var dependentItem = new DependencyResolvedItem.DependentItem()
                        {
                            AppId = deployFromAppId,
                            SubTableFieldCode = subtableKey,
                            FieldCode = fieldCode
                        };

                        foreach (var tempFieldCode in allFieldCodes)
                        {
                            if (expression.Contains(tempFieldCode))
                            {
                                dependentItem.PrecedentItems.Add(
                                    resolvedItem.PrecedentItems
                                    .Where(x => x.AppId == deployFromAppId && x.FieldCode == tempFieldCode)
                                    .Single()
                                );
                            }
                        }

                        resolvedItem.DependentItems.Add(dependentItem);
                    }
                }
                #endregion
                #endregion

                #region 関連レコード一覧
                foreach (var fieldCodeFieldTypePair in fieldCodeFieldTypePairs)
                {
                    var fieldCode = fieldCodeFieldTypePair.Key;
                    var fieldType = fieldCodeFieldTypePair.Value;
                    var val = (JObject)formJsonObj[fieldCode];
                    if (fieldType != "REFERENCE_TABLE")
                    {
                        continue;
                    }
                    var referenceTable = formJsonObj[fieldCode]["referenceTable"];
                    var referenceAppId = (int)referenceTable["relatedApp"]["app"];
                    var conditionField = referenceTable["condition"]["field"].ToString();
                    var conditionRelatedField = referenceTable["condition"]["relatedField"].ToString();
                    var filterCond = (string)referenceTable["filterCond"];
                    var displayFields = (JArray)referenceTable["displayFields"];
                    var displayFieldsStr = "";
                    for (var i = 0; i < displayFields.Count; i++)
                    {
                        displayFieldsStr += (", " + displayFields[i].ToString());
                    }
                    var sort = (string)referenceTable["sort"];
                    var dependentItem = new DependencyResolvedItem.DependentItem()
                    {
                        AppId = deployFromAppId,
                        SubTableFieldCode = null,
                        FieldCode = fieldCode,
                    };

                    foreach (var tempFieldCode in allFieldCodes)
                    {
                        if (conditionField == tempFieldCode)
                        {
                            dependentItem.PrecedentItems.Add(
                                resolvedItem.PrecedentItems
                                .Where(x => x.AppId == deployFromAppId && x.FieldCode == tempFieldCode)
                                .Single()
                            );
                        }
                    }

                    var referenceAppJson = formJsons.Where(x => x.DeployFromAppId == referenceAppId).SingleOrDefault()?.FormJsonString;
                    var referenceAppAllFieldCodes = GetAllFieldCodes(referenceAppJson);
                    foreach (var tempFieldCode in referenceAppAllFieldCodes)
                    {
                        if (conditionRelatedField == tempFieldCode ||
                            filterCond.Contains(tempFieldCode) ||
                            displayFieldsStr.Contains(tempFieldCode) ||
                            sort.Contains(tempFieldCode))
                        {
                            dependentItem.PrecedentItems.Add(
                                resolvedItem.PrecedentItems
                                .Where(x => x.AppId == referenceAppId && x.FieldCode == tempFieldCode)
                                .Single()
                            );
                        }
                    }

                    resolvedItem.DependentOnOtherAppItems.Add(dependentItem);
                    resolvedItem.DependentItems.Add(dependentItem);
                }
                #endregion

                #region ルックアップ
                #region サブテーブル以外の項目
                foreach (var fieldCodeFieldTypePair in fieldCodeFieldTypePairs)
                {
                    var fieldCode = fieldCodeFieldTypePair.Key;
                    var fieldType = fieldCodeFieldTypePair.Value;
                    var val = (JObject)formJsonObj[fieldCode];
                    if (val?["lookup"] == null)
                    {
                        continue;
                    }
                    var lookup = formJsonObj[fieldCode]["lookup"];
                    var referenceAppId = (int)lookup["relatedApp"]["app"];
                    var relatedKeyField = (string)lookup["relatedKeyField"];
                    var fieldMappings = (JArray)lookup["fieldMappings"];
                    string fieldMappingsCopyTo = "";
                    string fieldMappingsCopyFrom = "";
                    for (var i = 0; i < fieldMappings.Count; i++)
                    {
                        fieldMappingsCopyTo += (", " + (string)fieldMappings[i]["field"]);
                        fieldMappingsCopyFrom += (", " + (string)fieldMappings[i]["relatedField"]);
                    }
                    var lookupPickerFields = (JArray)lookup["lookupPickerFields"];
                    var lookupPickerFieldsStr = "";
                    for (var i = 0; i < lookupPickerFields.Count; i++)
                    {
                        lookupPickerFieldsStr += (", " + (string)lookupPickerFields[i]);
                    }
                    var filterCond = (string)lookup["filterCond"];
                    var sort = (string)lookup["sort"];
                    var dependentItem = new DependencyResolvedItem.DependentItem()
                    {
                        AppId = deployFromAppId,
                        SubTableFieldCode = null,
                        FieldCode = fieldCode,
                    };

                    foreach (var tempFieldCode in allFieldCodes)
                    {
                        if (fieldMappingsCopyTo.Contains(tempFieldCode))
                        {
                            dependentItem.PrecedentItems.Add(
                                resolvedItem.PrecedentItems
                                .Where(x => x.AppId == deployFromAppId && x.FieldCode == tempFieldCode)
                                .Single()
                            );
                        }
                    }

                    var referenceAppJson = formJsons.Where(x => x.DeployFromAppId == referenceAppId).SingleOrDefault()?.FormJsonString;
                    var referenceAppAllFieldCodes = GetAllFieldCodes(referenceAppJson);
                    foreach (var tempFieldCode in referenceAppAllFieldCodes)
                    {
                        if ((relatedKeyField == tempFieldCode) ||
                            fieldMappingsCopyFrom.Contains(tempFieldCode) ||
                            lookupPickerFieldsStr.Contains(tempFieldCode) ||
                            filterCond.Contains(tempFieldCode) ||
                            sort.Contains(tempFieldCode))
                        {
                            dependentItem.PrecedentItems.Add(
                                resolvedItem.PrecedentItems
                                .Where(x => x.AppId == referenceAppId && x.FieldCode == tempFieldCode)
                                .Single()
                            );
                        }
                    }

                    resolvedItem.DependentOnOtherAppItems.Add(dependentItem);
                    resolvedItem.DependentItems.Add(dependentItem);
                }
                #endregion

                #region サブテーブルの項目
                foreach (var subtableKey in subTableKeys)
                {
                    foreach (var fieldCodeFieldTypePairInSubtable in fieldCodeFieldTypePairsInSubtable)
                    {
                        var fieldCode = fieldCodeFieldTypePairInSubtable.Key;
                        var fieldType = fieldCodeFieldTypePairInSubtable.Value;
                        var val = (JObject)formJsonObj[subtableKey]["fields"][fieldCode];
                        if (val?["lookup"] == null)
                        {
                            continue;
                        }
                        var lookup = formJsonObj[subtableKey]["fields"][fieldCode]["lookup"];
                        var referenceAppId = (int)lookup["relatedApp"]["app"];
                        var relatedKeyField = (string)lookup["relatedKeyField"];
                        var fieldMappings = (JArray)lookup["fieldMappings"];
                        string fieldMappingsCopyTo = "";
                        string fieldMappingsCopyFrom = "";
                        for (var i = 0; i < fieldMappings.Count; i++)
                        {
                            fieldMappingsCopyTo += (", " + (string)fieldMappings[i]["field"]);
                            fieldMappingsCopyFrom += (", " + (string)fieldMappings[i]["relatedField"]);
                        }
                        var lookupPickerFields = (JArray)lookup["lookupPickerFields"];
                        var lookupPickerFieldsStr = "";
                        for (var i = 0; i < lookupPickerFields.Count; i++)
                        {
                            lookupPickerFieldsStr += (", " + (string)lookupPickerFields[i]);
                        }
                        var filterCond = (string)lookup["filterCond"];
                        var sort = (string)lookup["sort"];
                        var dependentItem = new DependencyResolvedItem.DependentItem()
                        {
                            AppId = deployFromAppId,
                            SubTableFieldCode = null,
                            FieldCode = fieldCode,
                        };

                        foreach (var tempFieldCode in allFieldCodes)
                        {
                            if (fieldMappingsCopyTo.Contains(tempFieldCode))
                            {
                                dependentItem.PrecedentItems.Add(
                                    resolvedItem.PrecedentItems
                                    .Where(x => x.AppId == deployFromAppId && x.FieldCode == tempFieldCode)
                                    .Single()
                                );
                            }
                        }

                        var referenceAppJson = formJsons.Where(x => x.DeployFromAppId == referenceAppId).SingleOrDefault()?.FormJsonString;
                        var referenceAppAllFieldCodes = GetAllFieldCodes(referenceAppJson);
                        foreach (var tempFieldCode in referenceAppAllFieldCodes)
                        {
                            if ((relatedKeyField == tempFieldCode) ||
                                fieldMappingsCopyFrom.Contains(tempFieldCode) ||
                                lookupPickerFieldsStr.Contains(tempFieldCode) ||
                                filterCond.Contains(tempFieldCode) ||
                                sort.Contains(tempFieldCode))
                            {
                                dependentItem.PrecedentItems.Add(
                                    resolvedItem.PrecedentItems
                                    .Where(x => x.AppId == referenceAppId && x.FieldCode == tempFieldCode)
                                    .Single()
                                );
                            }
                        }

                        resolvedItem.DependentOnOtherAppItems.Add(dependentItem);
                        resolvedItem.DependentItems.Add(dependentItem);
                    }
                }
                #endregion
                #endregion

            }

            return resolvedItem;
        }

        private static List<string> GetAllFieldCodes(string jsonStr)
        {
            var result = new List<string>();
            if (string.IsNullOrEmpty(jsonStr))
            {
                return result;
            }

            #region サブテーブル以外の項目
            var fieldCodeFieldTypePairs = GetFieldCodeFieldTypePairs(jsonStr);
            foreach (var fieldCodeFieldTypePair in fieldCodeFieldTypePairs)
            {
                var fieldCode = fieldCodeFieldTypePair.Key;
                result.Add(fieldCode);
            }
            #endregion

            #region サブテーブルの項目
            var subTableKeys = GetSubTableFieldCodes(jsonStr);
            var fieldCodeFieldTypePairsInSubtable = GetFieldCodeFieldTypeInSubTablePairs(jsonStr, subTableKeys);

            foreach (var subtableKey in subTableKeys)
            {
                foreach (var fieldCodeFieldTypePairInSubtable in fieldCodeFieldTypePairsInSubtable)
                {
                    var fieldCode = fieldCodeFieldTypePairInSubtable.Key;
                    result.Add(fieldCode);
                }
            }
            #endregion

            return result;
        }
    }
}
