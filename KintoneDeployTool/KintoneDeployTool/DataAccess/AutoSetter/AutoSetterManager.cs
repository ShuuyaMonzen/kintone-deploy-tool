using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System;
using System.Collections.Generic;

namespace KintoneDeployTool.DataAccess.AutoSetter
{
    public class AutoSetterManager
    {
        // Insert時の自動設定カラム
        private readonly IList<AutoSetterBase> insertAutoSetters = new List<AutoSetterBase>();

        // Update時の自動設定カラム
        private readonly IList<AutoSetterBase> updateAutoSetters = new List<AutoSetterBase>();


        /// <summary>
        /// コンストラクタ。
        /// </summary>
        /// <param name="createdAutoSetter"></param>
        /// <param name="updatedAutoSetter"></param>
        public AutoSetterManager(
            CreatedAutoSetter createdAutoSetter,
            UpdatedAutoSetter updatedAutoSetter
            )
        {
            insertAutoSetters.Add(createdAutoSetter);
            insertAutoSetters.Add(updatedAutoSetter);

            updateAutoSetters.Add(updatedAutoSetter);
        }


        /// <summary>
        /// 自動設定を実行する。
        /// </summary>
        /// <param name="entry"></param>
        public virtual void Set(EntityEntry entry)
        {
            if (entry == null)
            {
                throw new ArgumentNullException(nameof(entry));
            }

            Set(entry.Entity, entry.State);
        }

        /// <summary>
        /// 自動設定を実行する。
        /// </summary>
        /// <param name="entity"></param>
        /// <param name="state"></param>
        public virtual void Set(object entity, EntityState state)
        {
            if (entity == null) throw new ArgumentNullException(nameof(entity));

            // 自動設定
            switch (state)
            {
                case EntityState.Added:
                    SetCore(insertAutoSetters, entity);
                    break;
                case EntityState.Modified:
                    SetCore(updateAutoSetters, entity);
                    break;
            }
        }

        /// <summary>
        /// 自動設定を実行する。
        /// </summary>
        /// <param name="setters"></param>
        /// <param name="entity"></param>
        private void SetCore(IEnumerable<AutoSetterBase> setters, object entity)
        {
            foreach (var setter in setters)
            {
                setter.SetValues(entity);
            }
        }

    }
}
