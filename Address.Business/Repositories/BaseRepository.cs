using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Adapter.DataBase;
using Address.Business.Entities;

namespace Address.Business.Repositories
{
    public class BaseRepository
    {
        protected IDBAdapter _dbAdapter;

        public BaseRepository()
        {
            if (_dbAdapter == null)
            { _dbAdapter = new MSSqlDBAdapter("address.connenction"); }
        }
    }
}
