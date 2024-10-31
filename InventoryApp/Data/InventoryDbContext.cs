using InventoryApp.Models;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventoryApp.Data
{
    public class InventoryDbContext : DbContext
    {
        public DbSet<Item> Items { get; set; }  

        public InventoryDbContext(DbContextOptions<InventoryDbContext> options) : base(options) { }

    }
}
