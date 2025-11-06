# Migration Consolidation

## Overview
All existing migration files have been consolidated into a single migration file: `1703000000000-InitialSchema.ts`

## What was done:
1. **Analyzed 22 existing migration files** to understand the complete database schema
2. **Created a single consolidated migration** that includes all tables and their final state
3. **Removed duplicate and conflicting migrations** that were causing schema inconsistencies
4. **Backed up original migrations** in `migrations_backup/` directory for reference

## Tables included in the consolidated migration:

### Core Tables:
- **companies** - Company information with multi-tenant support
- **users** - User accounts with role-based access
- **user_profiles** - Extended user profile information
- **company_settings** - Company-specific configuration settings

### RBAC System:
- **roles** - System roles (Owner, Staff, Accountant)
- **permissions** - Granular permissions
- **role_permissions** - Role-permission mappings

### Business Logic:
- **customers** - Customer management
- **items** - Product/service catalog
- **invoices** - Invoice management with multi-currency support
- **invoice_lines** - Invoice line items
- **payments** - Payment tracking
- **vat_settings** - VAT configuration per country
- **invoice_templates** - Invoice template system

## Key Features:
- ✅ Multi-tenant architecture with proper foreign keys
- ✅ UUID primary keys for all tables
- ✅ Proper indexing for performance
- ✅ Country-specific VAT support (UAE, KSA, Egypt)
- ✅ Multi-currency support (AED, SAR, EGP)
- ✅ Bilingual support (English/Arabic)
- ✅ Audit trails with created_at/updated_at timestamps
- ✅ Proper cascade deletion for data integrity

## Migration Benefits:
1. **Single source of truth** - One migration file defines the complete schema
2. **No conflicts** - Eliminates migration order dependencies and conflicts
3. **Clean database** - Fresh installations get the complete schema in one step
4. **Easier maintenance** - Single file to manage instead of 22+ files
5. **Performance** - Faster database setup for new environments

## Usage:
```bash
# Reset database (development only)
npm run db:reset

# Run the consolidated migration
npm run migration:run
```

## Backup Location:
Original migration files are preserved in: `src/database/migrations_backup/`

## Next Steps:
- Test the consolidated migration in development environment
- Update any deployment scripts to use the new migration
- Consider this as the baseline for future migrations