using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using KintoneDeployTool.DataAccess.DomainModel;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;

namespace KintoneDeployTool.DataAccess.Repository
{
    public abstract class BaseRepository<TContext> where TContext : DbContext
    {
        /// <summary>
        /// DBのコンテキストオブジェクト
        /// </summary>
        protected TContext DbContext { get; private set; }

        /// <summary>
        /// コンストラクタ。サブクラスではこのコンストラクタを使う。
        /// </summary>
        /// <param name="dbContext"><see cref="DbContext"/>オブジェクト</param>
        public BaseRepository(TContext dbContext)
        {
            DbContext = dbContext;
        }


        /// <summary>
        /// 全ての変更を記録する。
        /// このリポジトリオブジェクトを通じて操作したエンティティオブジェクトだけでなく、
        /// DbContext に対してなされた変更の全てが記録されることに注意！
        /// </summary>
        public virtual void SaveChanges()
        {
            // 例外処理は各WorkerServiceにてキャッチ,ログに追加,画面にエラーメッセージを返すこと
            DbContext.SaveChanges();
            
        }

        
    }

    public static class ExtendQuery
    {
        public static IQueryable<TEntity> IncludeAll<TEntity>(
        this DbSet<TEntity> dbSet,
        int maxDepth = int.MaxValue) where TEntity : class
        {
            IQueryable<TEntity> result = dbSet;
            var context = dbSet.GetService<ICurrentDbContext>().Context;
            var includePaths = GetIncludePaths<TEntity>(context, maxDepth);

            foreach (var includePath in includePaths)
            {
                result = result.Include(includePath);
            }

            return result;
        }

        private static IEnumerable<string> GetIncludePaths<T>(this DbContext context, int maxDepth = int.MaxValue)
        {
            if (maxDepth < 0) throw new ArgumentOutOfRangeException(nameof(maxDepth));
            var entityType = context.Model.FindEntityType(typeof(T));
            var includedNavigations = new HashSet<INavigation>();
            var stack = new Stack<IEnumerator<INavigation>>();
            while (true)
            {
                var entityNavigations = new List<INavigation>();
                if (stack.Count <= maxDepth)
                {
                    foreach (var navigation in entityType.GetNavigations())
                    {
                        if (includedNavigations.Add(navigation))
                            entityNavigations.Add(navigation);
                    }
                }
                if (entityNavigations.Count == 0)
                {
                    if (stack.Count > 0)
                        yield return string.Join(".", stack.Reverse().Select(e => e.Current.Name));
                }
                else
                {
                    foreach (var navigation in entityNavigations)
                    {
                        var inverseNavigation = navigation.Inverse;
                        if (inverseNavigation != null)
                            includedNavigations.Add(inverseNavigation);
                    }
                    stack.Push(entityNavigations.GetEnumerator());
                }
                while (stack.Count > 0 && !stack.Peek().MoveNext())
                    stack.Pop();
                if (stack.Count == 0) break;
                entityType = stack.Peek().Current.TargetEntityType;
            }
        }

    }
}
