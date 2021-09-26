using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ClothAAPIS.Models
{
    public class ClothAppContext : DbContext
    {
        public ClothAppContext(DbContextOptions<ClothAppContext> options) : base(options)
        {

        }

        public DbSet<Product> Products { get; set; }
    }
}
