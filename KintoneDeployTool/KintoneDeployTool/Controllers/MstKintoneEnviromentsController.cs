using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using KintoneDeployTool.DataAccess;
using KintoneDeployTool.DataAccess.DomainModel;
using KintoneDeployTool.DataAccess.Const;
using KintoneDeployTool.WorkerServices;
using Microsoft.AspNetCore.Http;

namespace KintoneDeployTool.Controllers
{
    public class MstKintoneEnviromentsController : BaseController<MstKintoneEnviromentsWorkerService>
    {
        private readonly AppInnerDBContext _context;

        public MstKintoneEnviromentsController(
            IHttpContextAccessor httpContextAccessor,
            MstKintoneEnviromentsWorkerService service,
            AppInnerDBContext context) : base(httpContextAccessor, service)
        {
            _context = context;
        }

        // GET: MstKintoneEnviroments
        public async Task<IActionResult> Index()
        {
            return View(await _context.MstKintoneEnviroment.ToListAsync());
        }

        public async Task<IActionResult> Sync()
        {
            await Service.SyncMstKintoneApp();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return Ok();
        }

        // GET: MstKintoneEnviroments/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var mstKintoneEnviroment = await _context.MstKintoneEnviroment
                .Include(x => x.MstKintoneApps)
                .Where(m => m.MstKintoneEnviromentID == id)
                .FirstOrDefaultAsync();
            if (mstKintoneEnviroment == null)
            {
                return NotFound();
            }

            return View(mstKintoneEnviroment);
        }

        // GET: MstKintoneEnviroments/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: MstKintoneEnviroments/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("MstKintoneEnviromentID,EnviromentName,SubDomain,UserID,Password,CreatedAt,UpdatedAt,MstKintoneApps")] MstKintoneEnviroment mstKintoneEnviroment)
        {
            if (ModelState.IsValid)
            {
                if (mstKintoneEnviroment.MstKintoneApps != null)
                {
                    foreach (var mstKintoneApp in mstKintoneEnviroment.MstKintoneApps)
                    {
                        mstKintoneApp.MstKintoneAppID = 0;
                    }
                }

                _context.Add(mstKintoneEnviroment);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(mstKintoneEnviroment);
        }

        // GET: MstKintoneEnviroments/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var mstKintoneEnviroment = await _context.MstKintoneEnviroment
                .Include(x => x.MstKintoneApps)
                .Where(m => m.MstKintoneEnviromentID == id)
                .FirstOrDefaultAsync();
            if (mstKintoneEnviroment == null)
            {
                return NotFound();
            }
            mstKintoneEnviroment.Password = String.Empty;
            return View(mstKintoneEnviroment);
        }

        // POST: MstKintoneEnviroments/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("MstKintoneEnviromentID,EnviromentName,SubDomain,UserID,Password,CreatedAt,UpdatedAt,MstKintoneApps")] MstKintoneEnviroment mstKintoneEnviroment)
        {
            if (id != mstKintoneEnviroment.MstKintoneEnviromentID)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    if (mstKintoneEnviroment.MstKintoneApps != null)
                    {
                        foreach (var mstKintoneApp in mstKintoneEnviroment
                        .MstKintoneApps
                        .Where(x => x.MstKintoneAppID == CodeConst.ADD_TARGET_ID_VALUE))
                        {
                            mstKintoneApp.MstKintoneAppID = 0;
                            _context.Add(mstKintoneApp);
                        }
                    }

                    _context.Update(mstKintoneEnviroment);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!MstKintoneEnviromentExists(mstKintoneEnviroment.MstKintoneEnviromentID))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(mstKintoneEnviroment);
        }

        // GET: MstKintoneEnviroments/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var mstKintoneEnviroment = await _context.MstKintoneEnviroment
                .FirstOrDefaultAsync(m => m.MstKintoneEnviromentID == id);
            if (mstKintoneEnviroment == null)
            {
                return NotFound();
            }

            return View(mstKintoneEnviroment);
        }

        // POST: MstKintoneEnviroments/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var mstKintoneEnviroment = _context.MstKintoneEnviroment.Find(id);
            _context.MstKintoneEnviroment.Remove(mstKintoneEnviroment);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool MstKintoneEnviromentExists(int id)
        {
            return _context.MstKintoneEnviroment.Any(e => e.MstKintoneEnviromentID == id);
        }

        public IActionResult AddDetailsOnCreate([Bind("MstKintoneEnviromentID,EnviromentName,SubDomain,UserID,Password,CreatedAt,UpdatedAt,MstKintoneApps")] MstKintoneEnviroment mstKintoneEnviroment)
        {
            AddDetailsProc(mstKintoneEnviroment);
            return View("Create", mstKintoneEnviroment);
        }

        public IActionResult AddDetailsOnEdit([Bind("MstKintoneEnviromentID,EnviromentName,SubDomain,UserID,Password,CreatedAt,UpdatedAt,MstKintoneApps")] MstKintoneEnviroment mstKintoneEnviroment)
        {
            AddDetailsProc(mstKintoneEnviroment);
            return View("Edit", mstKintoneEnviroment);
        }

        private void AddDetailsProc(MstKintoneEnviroment mstKintoneEnviroment)
        {
            if (mstKintoneEnviroment.MstKintoneApps == null)
            {
                mstKintoneEnviroment.MstKintoneApps = new List<MstKintoneApp>();
            }

            mstKintoneEnviroment.MstKintoneApps.Add(new MstKintoneApp()
            {
                MstKintoneEnviromentID = mstKintoneEnviroment.MstKintoneEnviromentID,
                MstKintoneAppID = CodeConst.ADD_TARGET_ID_VALUE
            });
        }
    }
}
