using System;

namespace KintoneDeployTool.DataAccess.AutoSetter
{
    /// <summary>
    /// 更新系情報カラム値自動設定クラス
    /// </summary>
    public class UpdatedAutoSetter : AutoSetterBase
    {
        /// <summary>
        /// 値を設定する。
        /// </summary>
        /// <param name="entity"></param>
        internal override void SetValues(dynamic entity)
        {
            // DB登録時に、ミリ秒未満の情報の丸めによりC#とMySQLでミリ秒値の相違が発生するので
            // ミリ秒未満の情報を持たないようにDateTimeを作り直す

            var now = Clock.Now;
            entity.UpdatedAt = new DateTime(now.Year, now.Month, now.Day, now.Hour, now.Minute, now.Second).AddMilliseconds(now.Millisecond);
        }
    }
}
