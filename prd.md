Git remote add remove help
Create Next.js app with src TypeScript shadcn
TestMaster Web Next.js Development
API Route Verification Strategy
Git remote add remove help
git remote add origin https://github.com/seshu1234/testmaster-api.git remove add
It looks like you have a typo in your command. Here's the correct syntax:

To add a remote repository:
bash
git remote add origin https://github.com/seshu1234/testmaster-api.git
If you want to remove an existing remote:
bash
git remote remove origin
or

bash
git remote rm origin
To check your current remotes:
bash
git remote -v
The -v flag shows you the URLs that Git has stored for each remote (both fetch and push URLs).

Which operation were you trying to perform?

WARN Metadata found in doc-comment for method Tests\Feature\Api\V1\MarketplaceTest::it_can_publish_a_test_to_the_marketplace(). Metadata in doc-comments is deprecated and will no longer be supported in PHPUnit 12. Update your test code to use attributes instead.

WARN Metadata found in doc-comment for method Tests\Feature\Api\V1\MarketplaceTest::it_can_purchase_a_test_from_the_marketplace(). Metadata in doc-comments is deprecated and will no longer be supported in PHPUnit 12. Update your test code to use attributes instead.

PASS Tests\Unit\AdaptiveTestServiceTest
✓ calculate theta increases on correct answer 64.84s  
 ✓ calculate theta decreases on incorrect answer 48.77s  
 ✓ theta is capped at boundaries 46.56s

PASS Tests\Unit\ExampleTest
✓ that true is true 0.01s

PASS Tests\Unit\RouteNamingTest
✓ admin routes have admin prefix 47.15s  
 ✓ teacher routes have teacher prefix 48.16s  
 ✓ student routes have student prefix 48.21s

FAIL Tests\Unit\Services\CAT\AdaptiveTestServiceTest
⨯ it updates theta correctly on answer 49.36s  
 ⨯ it decreases theta on incorrect answer 50.21s

FAIL Tests\Feature\Api\V1\AiV2Test
⨯ it can get predictive analytics
⨯ it can generate a rescue test

FAIL Tests\Feature\Api\V1\InfrastructureV2Test
⨯ it can log and retrieve audit logs
⨯ it can dispatch webhooks

FAIL Tests\Feature\Api\V1\MarketplaceTest
⨯ it can publish a test to the marketplace
⨯ it can purchase a test from the marketplace

PASS Tests\Feature\ExampleTest
✓ the application returns a successful response 49.74s

PASS Tests\Feature\Middleware\RouteMiddlewareTest
✓ health route has correct middleware 50.29s  
 ✓ admin teachers route has correct middleware 49.47s

PASS Tests\Feature\OfflineSyncControllerTest
✓ offline sync creates attempts and triggers ai grading 51.32s

PASS Tests\Feature\TestTakingControllerTest
✓ submit attempts ai grading and triggers services 49.38s

FAIL Tests\Feature\Validation\RouteParameterValidationTest
⨯ tenant login route exists
⨯ tenant register route exists
⨯ login route exists
⨯ register route exists

FAIL Tests\Feature\WebhookServiceTest
⨯ webhook job dispatches with correct payload and hmac
⨯ webhook job fails and retries on error
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────  
 FAILED Tests\Unit\Services\CAT\AdaptiveTestServiceTest > it updates theta correctly on answer QueryException  
 SQLSTATE[23502]: Not null violation: 7 ERROR: null value in column "id" of relation "tests" violates not-null constraint
DETAIL: Failing row contains (null, null, CAT Test, null, null, null, null, null, null, null, null, 2026-03-01 18:43:58, 2026-03-01 18:43:58, null, f, null). (Connection: pgsql, SQL: insert into "tests" ("title", "updated_at", "created_at") values (CAT Test, 2026-03-01 18:43:58, 2026-03-01 18:43:58) returning "id")

at vendor/laravel/framework/src/Illuminate/Database/Connection.php:825
821▕ $this->getName(), $query, $this->prepareBindings($bindings), $e
    822▕                 );
    823▕             }
    824▕ 
  ➜ 825▕             throw new QueryException(
    826▕                 $this->getName(), $query, $this->prepareBindings($bindings), $e
827▕ );
828▕ }
829▕ }

      +19 vendor frames

20 tests/Unit/Services/CAT/AdaptiveTestServiceTest.php:20

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────  
 FAILED Tests\Unit\Services\CAT\AdaptiveTestServiceTest > it decreases theta on incorrect answer QueryException  
 SQLSTATE[23502]: Not null violation: 7 ERROR: null value in column "id" of relation "tests" violates not-null constraint
DETAIL: Failing row contains (null, null, CAT Test, null, null, null, null, null, null, null, null, 2026-03-01 18:44:48, 2026-03-01 18:44:48, null, f, null). (Connection: pgsql, SQL: insert into "tests" ("title", "updated_at", "created_at") values (CAT Test, 2026-03-01 18:44:48, 2026-03-01 18:44:48) returning "id")

at vendor/laravel/framework/src/Illuminate/Database/Connection.php:825
821▕ $this->getName(), $query, $this->prepareBindings($bindings), $e
    822▕                 );
    823▕             }
    824▕ 
  ➜ 825▕             throw new QueryException(
    826▕                 $this->getName(), $query, $this->prepareBindings($bindings), $e
827▕ );
828▕ }
829▕ }

      +19 vendor frames

20 tests/Unit/Services/CAT/AdaptiveTestServiceTest.php:43

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────  
 FAILED Tests\Feature\Api\V1\AiV2Test > it can get predictive analytics QueryException  
 SQLSTATE[22P02]: Invalid text representation: 7 ERROR: invalid input syntax for type uuid: "test-v2-tenant"
CONTEXT: unnamed portal parameter $1 = '...' (Connection: pgsql, SQL: insert into "tenants" ("id", "name", "data", "updated_at", "created_at") values (test-v2-tenant, Test V2 Tenant, [], 2026-03-01 18:45:36, 2026-03-01 18:45:36))

at vendor/laravel/framework/src/Illuminate/Database/Connection.php:825
821▕ $this->getName(), $query, $this->prepareBindings($bindings), $e
    822▕                 );
    823▕             }
    824▕ 
  ➜ 825▕             throw new QueryException(
    826▕                 $this->getName(), $query, $this->prepareBindings($bindings), $e
827▕ );
828▕ }
829▕ }

      +17 vendor frames

18 tests/Feature/Api/V1/AiV2Test.php:27

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────  
 FAILED Tests\Feature\Api\V1\AiV2Test > it can generate a rescue test QueryException  
 SQLSTATE[22P02]: Invalid text representation: 7 ERROR: invalid input syntax for type uuid: "test-v2-tenant"
CONTEXT: unnamed portal parameter $1 = '...' (Connection: pgsql, SQL: insert into "tenants" ("id", "name", "data", "updated_at", "created_at") values (test-v2-tenant, Test V2 Tenant, [], 2026-03-01 18:46:25, 2026-03-01 18:46:25))

at vendor/laravel/framework/src/Illuminate/Database/Connection.php:825
821▕ $this->getName(), $query, $this->prepareBindings($bindings), $e
    822▕                 );
    823▕             }
    824▕ 
  ➜ 825▕             throw new QueryException(
    826▕                 $this->getName(), $query, $this->prepareBindings($bindings), $e
827▕ );
828▕ }
829▕ }

      +17 vendor frames

18 tests/Feature/Api/V1/AiV2Test.php:27

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────  
 FAILED Tests\Feature\Api\V1\InfrastructureV2Test > it can log and retrieve audit logs QueryException  
 SQLSTATE[22P02]: Invalid text representation: 7 ERROR: invalid input syntax for type uuid: "infra-tenant"
CONTEXT: unnamed portal parameter $1 = '...' (Connection: pgsql, SQL: insert into "tenants" ("id", "name", "data", "updated_at", "created_at") values (infra-tenant, Infra Tenant, [], 2026-03-01 18:47:13, 2026-03-01 18:47:13))

at vendor/laravel/framework/src/Illuminate/Database/Connection.php:825
821▕ $this->getName(), $query, $this->prepareBindings($bindings), $e
    822▕                 );
    823▕             }
    824▕ 
  ➜ 825▕             throw new QueryException(
    826▕                 $this->getName(), $query, $this->prepareBindings($bindings), $e
827▕ );
828▕ }
829▕ }

      +17 vendor frames

18 tests/Feature/Api/V1/InfrastructureV2Test.php:25

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────  
 FAILED Tests\Feature\Api\V1\InfrastructureV2Test > it can dispatch webhooks QueryException  
 SQLSTATE[22P02]: Invalid text representation: 7 ERROR: invalid input syntax for type uuid: "infra-tenant"
CONTEXT: unnamed portal parameter $1 = '...' (Connection: pgsql, SQL: insert into "tenants" ("id", "name", "data", "updated_at", "created_at") values (infra-tenant, Infra Tenant, [], 2026-03-01 18:48:03, 2026-03-01 18:48:03))

at vendor/laravel/framework/src/Illuminate/Database/Connection.php:825
821▕ $this->getName(), $query, $this->prepareBindings($bindings), $e
    822▕                 );
    823▕             }
    824▕ 
  ➜ 825▕             throw new QueryException(
    826▕                 $this->getName(), $query, $this->prepareBindings($bindings), $e
827▕ );
828▕ }
829▕ }

      +17 vendor frames

18 tests/Feature/Api/V1/InfrastructureV2Test.php:25

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────  
 FAILED Tests\Feature\Api\V1\MarketplaceTest > it can publish a test to the marketplace QueryException  
 SQLSTATE[22P02]: Invalid text representation: 7 ERROR: invalid input syntax for type uuid: "tenant-a"
CONTEXT: unnamed portal parameter $1 = '...' (Connection: pgsql, SQL: insert into "tenants" ("id", "name", "data", "updated_at", "created_at") values (tenant-a, Tenant A, [], 2026-03-01 18:48:53, 2026-03-01 18:48:53))

at vendor/laravel/framework/src/Illuminate/Database/Connection.php:825
821▕ $this->getName(), $query, $this->prepareBindings($bindings), $e
    822▕                 );
    823▕             }
    824▕ 
  ➜ 825▕             throw new QueryException(
    826▕                 $this->getName(), $query, $this->prepareBindings($bindings), $e
827▕ );
828▕ }
829▕ }

      +17 vendor frames

18 tests/Feature/Api/V1/MarketplaceTest.php:25

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────  
 FAILED Tests\Feature\Api\V1\MarketplaceTest > it can purchase a test from the marketplace QueryException  
 SQLSTATE[22P02]: Invalid text representation: 7 ERROR: invalid input syntax for type uuid: "tenant-a"
CONTEXT: unnamed portal parameter $1 = '...' (Connection: pgsql, SQL: insert into "tenants" ("id", "name", "data", "updated_at", "created_at") values (tenant-a, Tenant A, [], 2026-03-01 18:49:42, 2026-03-01 18:49:42))

at vendor/laravel/framework/src/Illuminate/Database/Connection.php:825
821▕ $this->getName(), $query, $this->prepareBindings($bindings), $e
    822▕                 );
    823▕             }
    824▕ 
  ➜ 825▕             throw new QueryException(
    826▕                 $this->getName(), $query, $this->prepareBindings($bindings), $e
827▕ );
828▕ }
829▕ }

      +17 vendor frames

18 tests/Feature/Api/V1/MarketplaceTest.php:25

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────  
 FAILED Tests\Feature\Validation\RouteParameterValidationTest > tenant login route exists QueryException  
 SQLSTATE[42P01]: Undefined table: 7 ERROR: relation "questions" does not exist (Connection: pgsql, SQL: alter table "questions" add column "irt_discrimination" float(53) null)

at vendor/laravel/framework/src/Illuminate/Database/Connection.php:825
821▕ $this->getName(), $query, $this->prepareBindings($bindings), $e
    822▕                 );
    823▕             }
    824▕ 
  ➜ 825▕             throw new QueryException(
    826▕                 $this->getName(), $query, $this->prepareBindings($bindings), $e
827▕ );
828▕ }
829▕ }

      +10 vendor frames

11 database/migrations/tenant/2026_03_02_114500_add_v2_advanced_features.php:90
+38 vendor frames
50 tests/TestCase.php:18

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────  
 FAILED Tests\Feature\Validation\RouteParameterValidationTest > tenant register route exists QueryException  
 SQLSTATE[42P01]: Undefined table: 7 ERROR: relation "migrations" does not exist
LINE 1: insert into "migrations" ("migration", "batch") values ($1, ...
^ (Connection: pgsql, SQL: insert into "migrations" ("migration", "batch") values (2026_03_01_104737_create_activity_logs_table_central, 1))

at vendor/laravel/framework/src/Illuminate/Database/Connection.php:825
821▕ $this->getName(), $query, $this->prepareBindings($bindings), $e
    822▕                 );
    823▕             }
    824▕ 
  ➜ 825▕             throw new QueryException(
    826▕                 $this->getName(), $query, $this->prepareBindings($bindings), $e
827▕ );
828▕ }
829▕ }

      +40 vendor frames

41 tests/TestCase.php:18

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────  
 FAILED Tests\Feature\Validation\RouteParameterValidationTest > login route exists QueryException  
 SQLSTATE[42P01]: Undefined table: 7 ERROR: relation "users" does not exist (Connection: pgsql, SQL: alter table "uploaded_files" add constraint "uploaded_files_uploaded_by_foreign" foreign key ("uploaded_by") references "users" ("id") on delete set null)

at vendor/laravel/framework/src/Illuminate/Database/Connection.php:825
821▕ $this->getName(), $query, $this->prepareBindings($bindings), $e
    822▕                 );
    823▕             }
    824▕ 
  ➜ 825▕             throw new QueryException(
    826▕                 $this->getName(), $query, $this->prepareBindings($bindings), $e
827▕ );
828▕ }
829▕ }

      +10 vendor frames

11 database/migrations/tenant/2026_03_01_094932_create_uploaded_files_table.php:11
+38 vendor frames
50 tests/TestCase.php:18

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────  
 FAILED Tests\Feature\Validation\RouteParameterValidationTest > register route exists PDOException  
 SQLSTATE[HY000]: General error: 7 no connection to the server

at vendor/laravel/framework/src/Illuminate/Database/Concerns/ManagesTransactions.php:297
293▕ if ($toLevel == 0) {
    294▕             $pdo = $this->getPdo();
    295▕ 
    296▕             if ($pdo->inTransaction()) {
➜ 297▕ $pdo->rollBack();
    298▕             }
    299▕         } elseif ($this->queryGrammar->supportsSavepoints()) {
300▕ $this->getPdo()->exec(
    301▕                 $this->queryGrammar->compileSavepointRollBack('trans'.($toLevel + 1))

      +39 vendor frames

40 tests/TestCase.php:18

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────  
 FAILED Tests\Feature\WebhookServiceTest > webhook job dispatches with correct payload and hmac QueryException  
 SQLSTATE[57014]: Query canceled: 7 ERROR: canceling statement due to statement timeout
CONTEXT: while inserting index tuple (21,5) in relation "pg_type_typname_nsp_index" (Connection: pgsql, SQL: create table "batches" ("id" uuid not null, "tenant_id" uuid not null, "name" varchar(255) not null, "subject" varchar(255) null, "teacher_id" uuid null, "settings" json null, "created_at" timestamp(0) without time zone null, "updated_at" timestamp(0) without time zone null))

at vendor/laravel/framework/src/Illuminate/Database/Connection.php:825
821▕ $this->getName(), $query, $this->prepareBindings($bindings), $e
    822▕                 );
    823▕             }
    824▕ 
  ➜ 825▕             throw new QueryException(
    826▕                 $this->getName(), $query, $this->prepareBindings($bindings), $e
827▕ );
828▕ }
829▕ }

      +10 vendor frames

11 database/migrations/tenant/2026_03_01_042558_create_tenant_tables.php:13
+38 vendor frames
50 tests/TestCase.php:18

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────  
 FAILED Tests\Feature\WebhookServiceTest > webhook job fails and retries on error QueryException  
 SQLSTATE[57014]: Query canceled: 7 ERROR: canceling statement due to statement timeout
CONTEXT: while inserting index tuple (23,5) in relation "pg_type_typname_nsp_index" (Connection: pgsql, SQL: create table "batches" ("id" uuid not null, "tenant_id" uuid not null, "name" varchar(255) not null, "subject" varchar(255) null, "teacher_id" uuid null, "settings" json null, "created_at" timestamp(0) without time zone null, "updated_at" timestamp(0) without time zone null))

at vendor/laravel/framework/src/Illuminate/Database/Connection.php:825
821▕ $this->getName(), $query, $this->prepareBindings($bindings), $e
    822▕                 );
    823▕             }
    824▕ 
  ➜ 825▕             throw new QueryException(
    826▕                 $this->getName(), $query, $this->prepareBindings($bindings), $e
827▕ );
828▕ }
829▕ }

      +10 vendor frames

11 database/migrations/tenant/2026_03_01_042558_create_tenant_tables.php:13
+38 vendor frames
50 tests/TestCase.php:18

Tests: 14 failed, 12 passed (98 assertions)
Duration: 1782.46s

apple@Apples-MacBook-Air testmaster-api % find app/Models -name "Test.php"
app/Models/Test.php
apple@Apples-MacBook-Air testmaster-api % grep -r "use HasUuids" app/Models
app/Models/MarketplaceListing.php: use HasUuids;
app/Models/StudentPrediction.php: use HasUuids;
app/Models/Question.php: use HasUuids, BelongsToTenant, LogsActivity, Searchable;
app/Models/AIGradingLog.php: use HasUuids;
app/Models/WebhookDelivery.php: use HasUuids;
app/Models/Test.php: use HasUuids;
app/Models/WebhookEndpoint.php: use HasUuids, HasFactory;
app/Models/WebhookEvent.php: use HasUuids;
app/Models/Answer.php: use HasUuids, LogsActivity;
app/Models/AuditLog.php: use HasUuids;
app/Models/Plan.php: use HasUuids;
app/Models/Attempt.php: use HasUuids, LogsActivity;
apple@Apples-MacBook-Air testmaster-api % ls database/migrations/tenant/
2026_03_01_035049_create_tenant_brandings_table.php
2026_03_01_042558_create_tenant_tables.php
2026_03_01_094932_create_uploaded_files_table.php
2026_03_01_112216_add_encryption_to_users.php
2026_03_01_113000_add_ai_grading_to_answers_table.php
2026_03_01_114934_create_roles_and_permissions_tables.php
2026_03_01_172331_create_parent_student_table.php
2026_03_02_114500_add_v2_advanced_features.php
apple@Apples-MacBook-Air testmaster-api % php artisan test tests/Unit/Services/CAT/AdaptiveTestServiceTest.php tests/Feature/A
pi/V1/AiV2Test.php tests/Feature/Api/V1/InfrastructureV2Test.php tests/Feature/Api/V1/MarketplaceTest.php tests/Feature/Webhoo
kServiceTest.php tests/Feature/Validation/RouteParameterValidationTest.php

WARN Metadata found in doc-comment for method Tests\Unit\Services\CAT\AdaptiveTestServiceTest::it_updates_theta_correctly_on_answer(). Metadata in doc-comments is deprecated and will no longer be supported in PHPUnit 12. Update your test code to use attributes instead.

WARN Metadata found in doc-comment for method Tests\Unit\Services\CAT\AdaptiveTestServiceTest::it_decreases_theta_on_incorrect_answer(). Metadata in doc-comments is deprecated and will no longer be supported in PHPUnit 12. Update your test code to use attributes instead.

WARN Metadata found in doc-comment for method Tests\Feature\Api\V1\AiV2Test::it_can_get_predictive_analytics(). Metadata in doc-comments is deprecated and will no longer be supported in PHPUnit 12. Update your test code to use attributes instead.

WARN Metadata found in doc-comment for method Tests\Feature\Api\V1\AiV2Test::it_can_generate_a_rescue_test(). Metadata in doc-comments is deprecated and will no longer be supported in PHPUnit 12. Update your test code to use attributes instead.

WARN Metadata found in doc-comment for method Tests\Feature\Api\V1\InfrastructureV2Test::it_can_log_and_retrieve_audit_logs(). Metadata in doc-comments is deprecated and will no longer be supported in PHPUnit 12. Update your test code to use attributes instead.

WARN Metadata found in doc-comment for method Tests\Feature\Api\V1\InfrastructureV2Test::it_can_dispatch_webhooks(). Metadata in doc-comments is deprecated and will no longer be supported in PHPUnit 12. Update your test code to use attributes instead.

WARN Metadata found in doc-comment for method Tests\Feature\Api\V1\MarketplaceTest::it_can_publish_a_test_to_the_marketplace(). Metadata in doc-comments is deprecated and will no longer be supported in PHPUnit 12. Update your test code to use attributes instead.

WARN Metadata found in doc-comment for method Tests\Feature\Api\V1\MarketplaceTest::it_can_purchase_a_test_from_the_marketplace(). Metadata in doc-comments is deprecated and will no longer be supported in PHPUnit 12. Update your test code to use attributes instead.

FAIL Tests\Unit\Services\CAT\AdaptiveTestServiceTest
⨯ it updates theta correctly on answer
⨯ it decreases theta on incorrect answer 20.01s

FAIL Tests\Feature\Api\V1\AiV2Test
⨯ it can get predictive analytics
⨯ it can generate a rescue test

FAIL Tests\Feature\Api\V1\InfrastructureV2Test
⨯ it can log and retrieve audit logs
⨯ it can dispatch webhooks

FAIL Tests\Feature\Api\V1\MarketplaceTest
⨯ it can publish a test to the marketplace
⨯ it can purchase a test from the marketplace

FAIL Tests\Feature\WebhookServiceTest
⨯ webhook job dispatches with correct payload and hmac
⨯ webhook job fails and retries on error

PASS Tests\Feature\Validation\RouteParameterValidationTest
✓ tenant login route exists 1.05s  
 ✓ tenant register route exists 1.00s  
 ✓ login route exists 1.07s  
 ✓ register route exists 1.33s  
 ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────  
 FAILED Tests\Unit\Services\CAT\AdaptiveTestServiceTest > it updates theta correctly on answer QueryException  
 SQLSTATE[57014]: Query canceled: 7 ERROR: canceling statement due to statement timeout
CONTEXT: while inserting index tuple (20,10) in relation "pg_type_typname_nsp_index" (Connection: pgsql, SQL: create table "telescope_entries" ("sequence" bigserial not null primary key, "uuid" uuid not null, "batch_id" uuid not null, "family_hash" varchar(255) null, "should_display_on_index" boolean not null default '1', "type" varchar(20) not null, "content" text not null, "created_at" timestamp(0) without time zone null))

at vendor/laravel/framework/src/Illuminate/Database/Connection.php:825
821▕ $this->getName(), $query, $this->prepareBindings($bindings), $e
    822▕                 );
    823▕             }
    824▕ 
  ➜ 825▕             throw new QueryException(
    826▕                 $this->getName(), $query, $this->prepareBindings($bindings), $e
827▕ );
828▕ }
829▕ }

      +9 vendor frames

10 database/migrations/2026_03_01_065737_create_telescope_entries_table.php:24
+38 vendor frames
49 tests/TestCase.php:15

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────  
 FAILED Tests\Unit\Services\CAT\AdaptiveTestServiceTest > it decreases theta on incorrect answer QueryException  
 SQLSTATE[42P01]: Undefined table: 7 ERROR: relation "plans" does not exist
LINE 1: insert into "plans" ("name", "slug", "price_monthly", "price...
^ (Connection: pgsql, SQL: insert into "plans" ("name", "slug", "price_monthly", "price_annual", "student_limit", "id", "updated_at", "created_at") values (Test Plan, test-plan-mKEABoSdYp, 0, 0, 10, a132bd43-50cc-4c37-8a64-2908c2af56fa, 2026-03-01 19:22:37, 2026-03-01 19:22:37))

at vendor/laravel/framework/src/Illuminate/Database/Connection.php:825
821▕ $this->getName(), $query, $this->prepareBindings($bindings), $e
    822▕                 );
    823▕             }
    824▕ 
  ➜ 825▕             throw new QueryException(
    826▕                 $this->getName(), $query, $this->prepareBindings($bindings), $e
827▕ );
828▕ }
829▕ }

      +17 vendor frames

18 tests/Unit/Services/CAT/AdaptiveTestServiceTest.php:51

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────  
 FAILED Tests\Feature\Api\V1\AiV2Test > it can get predictive analytics QueryException  
 SQLSTATE[42P01]: Undefined table: 7 ERROR: relation "plans" does not exist
LINE 1: insert into "plans" ("name", "slug", "price_monthly", "price...
^ (Connection: pgsql, SQL: insert into "plans" ("name", "slug", "price_monthly", "price_annual", "student_limit", "id", "updated_at", "created_at") values (Test Plan, test-plan, 0, 0, 10, a132bd44-f8fe-4ddc-b38c-71b5de4a9418, 2026-03-01 19:22:38, 2026-03-01 19:22:38))

at vendor/laravel/framework/src/Illuminate/Database/Connection.php:825
821▕ $this->getName(), $query, $this->prepareBindings($bindings), $e
    822▕                 );
    823▕             }
    824▕ 
  ➜ 825▕             throw new QueryException(
    826▕                 $this->getName(), $query, $this->prepareBindings($bindings), $e
827▕ );
828▕ }
829▕ }

      +17 vendor frames

18 tests/Feature/Api/V1/AiV2Test.php:28

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────  
 FAILED Tests\Feature\Api\V1\AiV2Test > it can generate a rescue test QueryException  
 SQLSTATE[42P01]: Undefined table: 7 ERROR: relation "plans" does not exist
LINE 1: insert into "plans" ("name", "slug", "price_monthly", "price...
^ (Connection: pgsql, SQL: insert into "plans" ("name", "slug", "price_monthly", "price_annual", "student_limit", "id", "updated_at", "created_at") values (Test Plan, test-plan, 0, 0, 10, a132bd46-a96b-45d6-8a62-0ee300cf4017, 2026-03-01 19:22:39, 2026-03-01 19:22:39))

at vendor/laravel/framework/src/Illuminate/Database/Connection.php:825
821▕ $this->getName(), $query, $this->prepareBindings($bindings), $e
    822▕                 );
    823▕             }
    824▕ 
  ➜ 825▕             throw new QueryException(
    826▕                 $this->getName(), $query, $this->prepareBindings($bindings), $e
827▕ );
828▕ }
829▕ }

      +17 vendor frames

18 tests/Feature/Api/V1/AiV2Test.php:28

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────  
 FAILED Tests\Feature\Api\V1\InfrastructureV2Test > it can log and retrieve audit logs QueryException  
 SQLSTATE[42P01]: Undefined table: 7 ERROR: relation "plans" does not exist
LINE 1: insert into "plans" ("name", "slug", "price_monthly", "price...
^ (Connection: pgsql, SQL: insert into "plans" ("name", "slug", "price_monthly", "price_annual", "student_limit", "id", "updated_at", "created_at") values (Test Plan, test-plan, 0, 0, 10, a132bd48-e1e2-45d3-a1ed-50ffc8d95758, 2026-03-01 19:22:41, 2026-03-01 19:22:41))

at vendor/laravel/framework/src/Illuminate/Database/Connection.php:825
821▕ $this->getName(), $query, $this->prepareBindings($bindings), $e
    822▕                 );
    823▕             }
    824▕ 
  ➜ 825▕             throw new QueryException(
    826▕                 $this->getName(), $query, $this->prepareBindings($bindings), $e
827▕ );
828▕ }
829▕ }

      +17 vendor frames

18 tests/Feature/Api/V1/InfrastructureV2Test.php:26

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────  
 FAILED Tests\Feature\Api\V1\InfrastructureV2Test > it can dispatch webhooks QueryException  
 SQLSTATE[42P01]: Undefined table: 7 ERROR: relation "plans" does not exist
LINE 1: insert into "plans" ("name", "slug", "price_monthly", "price...
^ (Connection: pgsql, SQL: insert into "plans" ("name", "slug", "price_monthly", "price_annual", "student_limit", "id", "updated_at", "created_at") values (Test Plan, test-plan, 0, 0, 10, a132bd4a-bd15-4174-996e-f94636b0d2d3, 2026-03-01 19:22:42, 2026-03-01 19:22:42))

at vendor/laravel/framework/src/Illuminate/Database/Connection.php:825
821▕ $this->getName(), $query, $this->prepareBindings($bindings), $e
    822▕                 );
    823▕             }
    824▕ 
  ➜ 825▕             throw new QueryException(
    826▕                 $this->getName(), $query, $this->prepareBindings($bindings), $e
827▕ );
828▕ }
829▕ }

      +17 vendor frames

18 tests/Feature/Api/V1/InfrastructureV2Test.php:26

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────  
 FAILED Tests\Feature\Api\V1\MarketplaceTest > it can publish a test to the marketplace QueryException  
 SQLSTATE[42P01]: Undefined table: 7 ERROR: relation "plans" does not exist
LINE 1: insert into "plans" ("name", "slug", "price_monthly", "price...
^ (Connection: pgsql, SQL: insert into "plans" ("name", "slug", "price_monthly", "price_annual", "student_limit", "id", "updated_at", "created_at") values (Test Plan, test-plan, 0, 0, 10, a132bd4c-6df5-4ea4-9b52-75a731533356, 2026-03-01 19:22:43, 2026-03-01 19:22:43))

at vendor/laravel/framework/src/Illuminate/Database/Connection.php:825
821▕ $this->getName(), $query, $this->prepareBindings($bindings), $e
    822▕                 );
    823▕             }
    824▕ 
  ➜ 825▕             throw new QueryException(
    826▕                 $this->getName(), $query, $this->prepareBindings($bindings), $e
827▕ );
828▕ }
829▕ }

      +17 vendor frames

18 tests/Feature/Api/V1/MarketplaceTest.php:26

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────  
 FAILED Tests\Feature\Api\V1\MarketplaceTest > it can purchase a test from the marketplace QueryException  
 SQLSTATE[42P01]: Undefined table: 7 ERROR: relation "plans" does not exist
LINE 1: insert into "plans" ("name", "slug", "price_monthly", "price...
^ (Connection: pgsql, SQL: insert into "plans" ("name", "slug", "price_monthly", "price_annual", "student_limit", "id", "updated_at", "created_at") values (Test Plan, test-plan, 0, 0, 10, a132bd4e-205b-422d-9912-29d05caa4a9a, 2026-03-01 19:22:44, 2026-03-01 19:22:44))

at vendor/laravel/framework/src/Illuminate/Database/Connection.php:825
821▕ $this->getName(), $query, $this->prepareBindings($bindings), $e
    822▕                 );
    823▕             }
    824▕ 
  ➜ 825▕             throw new QueryException(
    826▕                 $this->getName(), $query, $this->prepareBindings($bindings), $e
827▕ );
828▕ }
829▕ }

      +17 vendor frames

18 tests/Feature/Api/V1/MarketplaceTest.php:26

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────  
 FAILED Tests\Feature\WebhookServiceTest > webhook job dispatches with correct payload and hmac QueryException  
 SQLSTATE[42P01]: Undefined table: 7 ERROR: relation "plans" does not exist
LINE 1: insert into "plans" ("id", "name", "slug", "price_monthly", ...
^ (Connection: pgsql, SQL: insert into "plans" ("id", "name", "slug", "price_monthly", "price_annual", "student_limit", "updated_at", "created_at") values (feda86ae-d0cc-4547-8ff0-90b1f0c30260, Test Plan, test-plan, 0, 0, 10, 2026-03-01 19:22:45, 2026-03-01 19:22:45))

at vendor/laravel/framework/src/Illuminate/Database/Connection.php:825
821▕ $this->getName(), $query, $this->prepareBindings($bindings), $e
    822▕                 );
    823▕             }
    824▕ 
  ➜ 825▕             throw new QueryException(
    826▕                 $this->getName(), $query, $this->prepareBindings($bindings), $e
827▕ );
828▕ }
829▕ }

      +17 vendor frames

18 tests/Feature/WebhookServiceTest.php:26

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────  
 FAILED Tests\Feature\WebhookServiceTest > webhook job fails and retries on error QueryException  
 SQLSTATE[42P01]: Undefined table: 7 ERROR: relation "plans" does not exist
LINE 1: insert into "plans" ("id", "name", "slug", "price_monthly", ...
^ (Connection: pgsql, SQL: insert into "plans" ("id", "name", "slug", "price_monthly", "price_annual", "student_limit", "updated_at", "created_at") values (68361c8c-2bd8-436b-98d7-c617df129d2a, Test Plan, test-plan, 0, 0, 10, 2026-03-01 19:22:46, 2026-03-01 19:22:46))

at vendor/laravel/framework/src/Illuminate/Database/Connection.php:825
821▕ $this->getName(), $query, $this->prepareBindings($bindings), $e
    822▕                 );
    823▕             }
    824▕ 
  ➜ 825▕             throw new QueryException(
    826▕                 $this->getName(), $query, $this->prepareBindings($bindings), $e
827▕ );
828▕ }
829▕ }

      +17 vendor frames

18 tests/Feature/WebhookServiceTest.php:26

Tests: 10 failed, 4 passed (4 assertions)
Duration: 158.87s

apple@Apples-MacBook-Air testmaster-api % php artisan test tests/Unit/Services/CAT/AdaptiveTestServiceTest.php

WARN Metadata found in doc-comment for method Tests\Unit\Services\CAT\AdaptiveTestServiceTest::it_updates_theta_correctly_on_answer(). Metadata in doc-comments is deprecated and will no longer be supported in PHPUnit 12. Update your test code to use attributes instead.

WARN Metadata found in doc-comment for method Tests\Unit\Services\CAT\AdaptiveTestServiceTest::it_decreases_theta_on_incorrect_answer(). Metadata in doc-comments is deprecated and will no longer be supported in PHPUnit 12. Update your test code to use attributes instead.

FAIL Tests\Unit\Services\CAT\AdaptiveTestServiceTest
⨯ it updates theta correctly on answer 15.64s  
 ⨯ it decreases theta on incorrect answer 1.10s  
 ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────  
 FAILED Tests\Unit\Services\CAT\AdaptiveTestServiceTest > it updates theta correctly on answer QueryException  
 SQLSTATE[42P01]: Undefined table: 7 ERROR: relation "plans" does not exist
LINE 1: insert into "plans" ("name", "slug", "price_monthly", "price...
^ (Connection: pgsql, SQL: insert into "plans" ("name", "slug", "price_monthly", "price_annual", "student_limit", "id", "updated_at", "created_at") values (Test Plan, test-plan-A5E7teU8GC, 0, 0, 10, a132bd7f-7a37-4c85-af75-c55c626eaa1a, 2026-03-01 19:23:16, 2026-03-01 19:23:16))

at vendor/laravel/framework/src/Illuminate/Database/Connection.php:825
821▕ $this->getName(), $query, $this->prepareBindings($bindings), $e
    822▕                 );
    823▕             }
    824▕ 
  ➜ 825▕             throw new QueryException(
    826▕                 $this->getName(), $query, $this->prepareBindings($bindings), $e
827▕ );
828▕ }
829▕ }

      +17 vendor frames

18 tests/Unit/Services/CAT/AdaptiveTestServiceTest.php:20

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────  
 FAILED Tests\Unit\Services\CAT\AdaptiveTestServiceTest > it decreases theta on incorrect answer QueryException  
 SQLSTATE[42P01]: Undefined table: 7 ERROR: relation "plans" does not exist
LINE 1: insert into "plans" ("name", "slug", "price_monthly", "price...
^ (Connection: pgsql, SQL: insert into "plans" ("name", "slug", "price_monthly", "price_annual", "student_limit", "id", "updated_at", "created_at") values (Test Plan, test-plan-zXSLNYSUpI, 0, 0, 10, a132bd81-3a77-4389-a63e-eae65cd93020, 2026-03-01 19:23:17, 2026-03-01 19:23:17))

at vendor/laravel/framework/src/Illuminate/Database/Connection.php:825
821▕ $this->getName(), $query, $this->prepareBindings($bindings), $e
    822▕                 );
    823▕             }
    824▕ 
  ➜ 825▕             throw new QueryException(
    826▕                 $this->getName(), $query, $this->prepareBindings($bindings), $e
827▕ );
828▕ }
829▕ }

      +17 vendor frames

18 tests/Unit/Services/CAT/AdaptiveTestServiceTest.php:51

Tests: 2 failed (0 assertions)
Duration: 16.79s

apple@Apples-MacBook-Air testmaster-api % git remote add origin git@github.com:seshu1234/testmaster-api.git
error: remote origin already exists.
apple@Apples-MacBook-Air testmaster-api % git push -u origin main
ERROR: Repository not found.
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
apple@Apples-MacBook-Air testmaster-api % git remote add origin https://github.com/seshu1234/testmaster-api.git
error: remote origin already exists.
apple@Apples-MacBook-Air testmaster-api % git init
Reinitialized existing Git repository in /Users/apple/Gitlab/testmaster-platform/testmaster-api/.git/
apple@Apples-MacBook-Air testmaster-api % php artisan test tests/Unit/Services/CAT/AdaptiveTestServiceTest.php tests/Feature/A
pi/V1/AiV2Test.php tests/Feature/Api/V1/InfrastructureV2Test.php tests/Feature/Api/V1/MarketplaceTest.php tests/Feature/Webhoo
kServiceTest.php tests/Feature/Validation/RouteParameterValidationTest.php
PHP Fatal error: Declaration of Illuminate\Foundation\Testing\RefreshDatabase::refreshTestDatabase() must be compatible with Tests\TestCase::refreshTestDatabase(): void in /Users/apple/Gitlab/testmaster-platform/testmaster-api/vendor/laravel/framework/src/Illuminate/Foundation/Testing/RefreshDatabase.php on line 63

Fatal error: Declaration of Illuminate\Foundation\Testing\RefreshDatabase::refreshTestDatabase() must be compatible with Tests\TestCase::refreshTestDatabase(): void in /Users/apple/Gitlab/testmaster-platform/testmaster-api/vendor/laravel/framework/src/Illuminate/Foundation/Testing/RefreshDatabase.php on line 63
apple@Apples-MacBook-Air testmaster-api % git remote remove origin
apple@Apples-MacBook-Air testmaster-api % git remote add origin https://github.com/seshu1234/testmaster-api.git
apple@Apples-MacBook-Air testmaster-api % git push -u origin main
Enumerating objects: 400, done.
Counting objects: 100% (400/400), done.
Delta compression using up to 8 threads
Compressing objects: 100% (376/376), done.
Writing objects: 100% (400/400), 198.62 KiB | 9.46 MiB/s, done.
Total 400 (delta 146), reused 0 (delta 0), pack-reused 0 (from 0)
remote: Resolving deltas: 100% (146/146), done.
To https://github.com/seshu1234/testmaster-api.git

- [new branch] main -> main
  branch 'main' set up to track 'origin/main'.
  apple@Apples-MacBook-Air testmaster-api % php artisan test tests/Unit/Services/CAT/AdaptiveTestServiceTest.php tests/Feature/A
  pi/V1/AiV2Test.php tests/Feature/Api/V1/InfrastructureV2Test.php tests/Feature/Api/V1/MarketplaceTest.php tests/Feature/Webhoo
  kServiceTest.php tests/Feature/Validation/RouteParameterValidationTest.php

  WARN Metadata found in doc-comment for method Tests\Unit\Services\CAT\AdaptiveTestServiceTest::it_updates_theta_correctly_on_answer(). Metadata in doc-comments is deprecated and will no longer be supported in PHPUnit 12. Update your test code to use attributes instead.

  WARN Metadata found in doc-comment for method Tests\Unit\Services\CAT\AdaptiveTestServiceTest::it_decreases_theta_on_incorrect_answer(). Metadata in doc-comments is deprecated and will no longer be supported in PHPUnit 12. Update your test code to use attributes instead.

  FAIL Tests\Unit\Services\CAT\AdaptiveTestServiceTest
  ⨯ it updates theta correctly on answer 15.68s  
   ⨯ it decreases theta on incorrect answer 1.12s

  FAIL Tests\Feature\Api\V1\AiV2Test
  ⨯ it can get predictive analytics
  ⨯ it can generate a rescue test

  FAIL Tests\Feature\Api\V1\InfrastructureV2Test
  ⨯ it can log and retrieve audit logs
  ⨯ it can dispatch webhooks

  FAIL Tests\Feature\Api\V1\MarketplaceTest
  ⨯ it can publish a test to the marketplace
  ⨯ it can purchase a test from the marketplace

  FAIL Tests\Feature\WebhookServiceTest
  ⨯ webhook job dispatches with correct payload and hmac
  ⨯ webhook job fails and retries on error

  PASS Tests\Feature\Validation\RouteParameterValidationTest
  ✓ tenant login route exists 2.00s  
   ✓ tenant register route exists 1.22s  
   ✓ login route exists 1.21s  
   ✓ register route exists 1.40s  
   ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────  
   FAILED Tests\Unit\Services\CAT\AdaptiveTestServiceTest > it updates theta correctly on answer QueryException  
   SQLSTATE[42P01]: Undefined table: 7 ERROR: relation "plans" does not exist
  LINE 1: insert into "plans" ("name", "slug", "price_monthly", "price...
  ^ (Connection: pgsql, SQL: insert into "plans" ("name", "slug", "price_monthly", "price_annual", "student_limit", "id", "updated_at", "created_at") values (Test Plan, test-plan-cU6JPjbcBy, 0, 0, 10, a132be84-5874-4c3e-bc11-3b4eee12cc01, 2026-03-01 19:26:07, 2026-03-01 19:26:07))

at vendor/laravel/framework/src/Illuminate/Database/Connection.php:825
821▕ $this->getName(), $query, $this->prepareBindings($bindings), $e
    822▕                 );
    823▕             }
    824▕ 
  ➜ 825▕             throw new QueryException(
    826▕                 $this->getName(), $query, $this->prepareBindings($bindings), $e
827▕ );
828▕ }
829▕ }

      +17 vendor frames

18 tests/Unit/Services/CAT/AdaptiveTestServiceTest.php:20

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────  
 FAILED Tests\Unit\Services\CAT\AdaptiveTestServiceTest > it decreases theta on incorrect answer QueryException  
 SQLSTATE[42P01]: Undefined table: 7 ERROR: relation "plans" does not exist
LINE 1: insert into "plans" ("name", "slug", "price_monthly", "price...
^ (Connection: pgsql, SQL: insert into "plans" ("name", "slug", "price_monthly", "price_annual", "student_limit", "id", "updated_at", "created_at") values (Test Plan, test-plan-s8cfqYJFHk, 0, 0, 10, a132be86-12bf-4226-9f81-6af0862d4f56, 2026-03-01 19:26:08, 2026-03-01 19:26:08))

at vendor/laravel/framework/src/Illuminate/Database/Connection.php:825
821▕ $this->getName(), $query, $this->prepareBindings($bindings), $e
    822▕                 );
    823▕             }
    824▕ 
  ➜ 825▕             throw new QueryException(
    826▕                 $this->getName(), $query, $this->prepareBindings($bindings), $e
827▕ );
828▕ }
829▕ }

      +17 vendor frames

18 tests/Unit/Services/CAT/AdaptiveTestServiceTest.php:51

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────  
 FAILED Tests\Feature\Api\V1\AiV2Test > it can get predictive analytics QueryException  
 SQLSTATE[42P01]: Undefined table: 7 ERROR: relation "plans" does not exist
LINE 1: insert into "plans" ("name", "slug", "price_monthly", "price...
^ (Connection: pgsql, SQL: insert into "plans" ("name", "slug", "price_monthly", "price_annual", "student_limit", "id", "updated_at", "created_at") values (Test Plan, test-plan, 0, 0, 10, a132be87-ab5d-4f3d-b7e1-cb9f61b0b96c, 2026-03-01 19:26:09, 2026-03-01 19:26:09))

at vendor/laravel/framework/src/Illuminate/Database/Connection.php:825
821▕ $this->getName(), $query, $this->prepareBindings($bindings), $e
    822▕                 );
    823▕             }
    824▕ 
  ➜ 825▕             throw new QueryException(
    826▕                 $this->getName(), $query, $this->prepareBindings($bindings), $e
827▕ );
828▕ }
829▕ }

      +17 vendor frames

18 tests/Feature/Api/V1/AiV2Test.php:29

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────  
 FAILED Tests\Feature\Api\V1\AiV2Test > it can generate a rescue test QueryException  
 SQLSTATE[42P01]: Undefined table: 7 ERROR: relation "plans" does not exist
LINE 1: insert into "plans" ("name", "slug", "price_monthly", "price...
^ (Connection: pgsql, SQL: insert into "plans" ("name", "slug", "price_monthly", "price_annual", "student_limit", "id", "updated_at", "created_at") values (Test Plan, test-plan, 0, 0, 10, a132be89-6303-4f87-9452-d1384e471c61, 2026-03-01 19:26:11, 2026-03-01 19:26:11))

at vendor/laravel/framework/src/Illuminate/Database/Connection.php:825
821▕ $this->getName(), $query, $this->prepareBindings($bindings), $e
    822▕                 );
    823▕             }
    824▕ 
  ➜ 825▕             throw new QueryException(
    826▕                 $this->getName(), $query, $this->prepareBindings($bindings), $e
827▕ );
828▕ }
829▕ }

      +17 vendor frames

18 tests/Feature/Api/V1/AiV2Test.php:29

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────  
 FAILED Tests\Feature\Api\V1\InfrastructureV2Test > it can log and retrieve audit logs QueryException  
 SQLSTATE[42P01]: Undefined table: 7 ERROR: relation "plans" does not exist
LINE 1: insert into "plans" ("name", "slug", "price_monthly", "price...
^ (Connection: pgsql, SQL: insert into "plans" ("name", "slug", "price_monthly", "price_annual", "student_limit", "id", "updated_at", "created_at") values (Test Plan, test-plan, 0, 0, 10, a132be8a-f7b2-44d1-ad6d-71e07b8724ac, 2026-03-01 19:26:12, 2026-03-01 19:26:12))

at vendor/laravel/framework/src/Illuminate/Database/Connection.php:825
821▕ $this->getName(), $query, $this->prepareBindings($bindings), $e
    822▕                 );
    823▕             }
    824▕ 
  ➜ 825▕             throw new QueryException(
    826▕                 $this->getName(), $query, $this->prepareBindings($bindings), $e
827▕ );
828▕ }
829▕ }

      +17 vendor frames

18 tests/Feature/Api/V1/InfrastructureV2Test.php:27

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────  
 FAILED Tests\Feature\Api\V1\InfrastructureV2Test > it can dispatch webhooks QueryException  
 SQLSTATE[42P01]: Undefined table: 7 ERROR: relation "plans" does not exist
LINE 1: insert into "plans" ("name", "slug", "price_monthly", "price...
^ (Connection: pgsql, SQL: insert into "plans" ("name", "slug", "price_monthly", "price_annual", "student_limit", "id", "updated_at", "created_at") values (Test Plan, test-plan, 0, 0, 10, a132be8c-8a3e-4949-b6a8-b994075ce3ca, 2026-03-01 19:26:13, 2026-03-01 19:26:13))

at vendor/laravel/framework/src/Illuminate/Database/Connection.php:825
821▕ $this->getName(), $query, $this->prepareBindings($bindings), $e
    822▕                 );
    823▕             }
    824▕ 
  ➜ 825▕             throw new QueryException(
    826▕                 $this->getName(), $query, $this->prepareBindings($bindings), $e
827▕ );
828▕ }
829▕ }

      +17 vendor frames

18 tests/Feature/Api/V1/InfrastructureV2Test.php:27

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────  
 FAILED Tests\Feature\Api\V1\MarketplaceTest > it can publish a test to the marketplace QueryException  
 SQLSTATE[42P01]: Undefined table: 7 ERROR: relation "plans" does not exist
LINE 1: insert into "plans" ("name", "slug", "price_monthly", "price...
^ (Connection: pgsql, SQL: insert into "plans" ("name", "slug", "price_monthly", "price_annual", "student_limit", "id", "updated_at", "created_at") values (Test Plan, test-plan, 0, 0, 10, a132be8e-2db4-45c6-9a4a-cc91fee5e66e, 2026-03-01 19:26:14, 2026-03-01 19:26:14))

at vendor/laravel/framework/src/Illuminate/Database/Connection.php:825
821▕ $this->getName(), $query, $this->prepareBindings($bindings), $e
    822▕                 );
    823▕             }
    824▕ 
  ➜ 825▕             throw new QueryException(
    826▕                 $this->getName(), $query, $this->prepareBindings($bindings), $e
827▕ );
828▕ }
829▕ }

      +17 vendor frames

18 tests/Feature/Api/V1/MarketplaceTest.php:27

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────  
 FAILED Tests\Feature\Api\V1\MarketplaceTest > it can purchase a test from the marketplace QueryException  
 SQLSTATE[42P01]: Undefined table: 7 ERROR: relation "plans" does not exist
LINE 1: insert into "plans" ("name", "slug", "price_monthly", "price...
^ (Connection: pgsql, SQL: insert into "plans" ("name", "slug", "price_monthly", "price_annual", "student_limit", "id", "updated_at", "created_at") values (Test Plan, test-plan, 0, 0, 10, a132be8f-b67a-4962-95bd-5435f667c5fd, 2026-03-01 19:26:15, 2026-03-01 19:26:15))

at vendor/laravel/framework/src/Illuminate/Database/Connection.php:825
821▕ $this->getName(), $query, $this->prepareBindings($bindings), $e
    822▕                 );
    823▕             }
    824▕ 
  ➜ 825▕             throw new QueryException(
    826▕                 $this->getName(), $query, $this->prepareBindings($bindings), $e
827▕ );
828▕ }
829▕ }

      +17 vendor frames

18 tests/Feature/Api/V1/MarketplaceTest.php:27

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────  
 FAILED Tests\Feature\WebhookServiceTest > webhook job dispatches with correct payload and hmac QueryException  
 SQLSTATE[42P01]: Undefined table: 7 ERROR: relation "plans" does not exist
LINE 1: insert into "plans" ("id", "name", "slug", "price_monthly", ...
^ (Connection: pgsql, SQL: insert into "plans" ("id", "name", "slug", "price_monthly", "price_annual", "student_limit", "updated_at", "created_at") values (9bfb8470-f4c6-48ca-92a9-5cd36ee4ee3f, Test Plan, test-plan, 0, 0, 10, 2026-03-01 19:26:16, 2026-03-01 19:26:16))

at vendor/laravel/framework/src/Illuminate/Database/Connection.php:825
821▕ $this->getName(), $query, $this->prepareBindings($bindings), $e
    822▕                 );
    823▕             }
    824▕ 
  ➜ 825▕             throw new QueryException(
    826▕                 $this->getName(), $query, $this->prepareBindings($bindings), $e
827▕ );
828▕ }
829▕ }

      +17 vendor frames

18 tests/Feature/WebhookServiceTest.php:26

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────  
 FAILED Tests\Feature\WebhookServiceTest > webhook job fails and retries on error QueryException  
 SQLSTATE[42P01]: Undefined table: 7 ERROR: relation "plans" does not exist
LINE 1: insert into "plans" ("id", "name", "slug", "price_monthly", ...
^ (Connection: pgsql, SQL: insert into "plans" ("id", "name", "slug", "price_monthly", "price_annual", "student_limit", "updated_at", "created_at") values (f6b09fdd-a655-429c-811e-c50d95d921ff, Test Plan, test-plan, 0, 0, 10, 2026-03-01 19:26:17, 2026-03-01 19:26:17))

at vendor/laravel/framework/src/Illuminate/Database/Connection.php:825
821▕ $this->getName(), $query, $this->prepareBindings($bindings), $e
    822▕                 );
    823▕             }
    824▕ 
  ➜ 825▕             throw new QueryException(
    826▕                 $this->getName(), $query, $this->prepareBindings($bindings), $e
827▕ );
828▕ }
829▕ }

      +17 vendor frames

18 tests/Feature/WebhookServiceTest.php:26

Tests: 10 failed, 4 passed (4 assertions)
Duration: 31.21s

apple@Apples-MacBook-Air testmaster-api %
I can see you're dealing with multiple issues:

Git remote - You successfully fixed this by removing the existing remote and adding it correctly

Test failures - You have several failing tests with database-related errors

The main issues in your tests are:

1. Database Schema Problems
   Most tests are failing because:

plans table doesn't exist (trying to insert into non-existent table)

UUID validation errors (trying to insert non-UUID strings into UUID columns)

Missing tables like questions, users, etc.

2. Migration Issues
   The errors suggest your migrations aren't running properly before tests. Here's how to fix this:

Check your TestCase setup
php
// tests/TestCase.php

<?php

namespace Tests;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;
    use RefreshDatabase;
    
    protected function setUp(): void
    {
        parent::setUp();
        
        // Run migrations before each test
        $this->artisan('migrate:fresh');
        
        // Run seeders if needed
        // $this->artisan('db:seed');
    }
}
For multi-tenant tests, make sure you're:
Running central migrations first

Then creating tenants with proper UUIDs

Running tenant migrations

3. Fix UUID Issues
Your tenant IDs should be valid UUIDs, not strings like 'tenant-a':

php
// In your tests, use proper UUIDs
$tenant = Tenant::create([
    'id' => \Illuminate\Support\Str::uuid(), // Generate valid UUID
    'name' => 'Tenant A',
    'data' => []
]);
4. Run Migrations Before Tests
bash
# Run migrations fresh
php artisan migrate:fresh

# If you have separate tenant migrations
php artisan tenants:migrate-fresh

# Then run tests
php artisan test
5. Create a Test-Specific Database
Make sure your .env.testing file has a separate database:

text
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=testmaster_testing
DB_USERNAME=your_username
DB_PASSWORD=your_password
Then create the test database:

bash
php artisan test --create-databases
Would you like me to help you fix a specific test or migration issue first?

What are tghe super admin fucntinsdasboard needed for this p
I understand you're asking about Super Admin functions/dashboard needed for this application. Based on your test output showing a multi-tenant architecture (with central and tenant databases), here are the essential super admin functions:

🚀 Core Super Admin Dashboard Functions
1. Tenant Management
text
├── View all tenants
├── Create new tenant
├── Edit tenant details
├── Suspend/Activate tenant
├── Delete tenant
├── View tenant usage/stats
└── Manage tenant subscriptions
2. User Management (Global)
text
├── View all users across tenants
├── Manage super admin users
├── Impersonate any tenant/user (for support)
├── Global role/permissions management
└── User activity logs across platform
3. Subscription & Billing
text
├── View all subscriptions
├── Manage pricing plans
├── Create/Edit plans
├── View revenue reports
├── Handle failed payments
├── Generate invoices
└── Apply discounts/coupons
4. System Monitoring
text
├── System health dashboard
├── API usage metrics
├── Error logs and exceptions
├── Queue monitoring
├── Cache statistics
├── Database performance
└── Server resource usage
5. Audit & Compliance
text
├── Global audit logs
├── Security events
├── Login attempts
├── Data export requests
├── GDPR compliance tools
└── Backup management
6. Feature Management
text
├── Feature flags/toggles
├── Roll out features per tenant
├── A/B testing controls
├── Maintenance mode
└── Version management
7. Marketplace Management (from your tests)
text
├── Approve/Reject marketplace listings
├── Featured listings
├── Category management
├── Review reported content
├── Marketplace analytics
└── Revenue sharing reports
8. AI & Analytics Oversight (from AiV2Test)
text
├── View AI usage across tenants
├── Model performance metrics
├── Training data management
├── AI credit usage
├── Predictive analytics dashboard
└── Rescue test configurations
9. Webhook Management (from WebhookServiceTest)
text
├── View all webhook deliveries
├── Retry failed webhooks
├── Webhook endpoint management
├── Delivery logs
└── Webhook performance metrics
10. Support Tools
text
├── Ticket system overview
├── Announcement broadcast
├── System notifications
├── Maintenance announcements
└── Help center/content management
📊 Dashboard Layout Suggestions
text
┌─────────────────────────────────────┐
│  SUPER ADMIN DASHBOARD              │
├─────────────────────────────────────┤
│  [Quick Stats]                       │
│  Total Tenants: 24  │ Active: 22    │
│  Total Users: 1,245 │ Revenue: $12K │
├─────────────────────────────────────┤
│                                      │
│  [Recent Tenants]    [System Health] │
│  • Tenant A          • CPU: 45%     │
│  • Tenant B          • Memory: 62%  │
│  • Tenant C          • Queue: 128   │
│                                      │
│  [Pending Actions]   [Recent Errors] │
│  • 3 listings pending • Error 500   │
│  • 2 support tickets  • Timeout     │
│  • 5 failed payments  • Connection  │
│                                      │
└─────────────────────────────────────┘
🛠️ Implementation Priority
Phase 1 (Essential)
Tenant CRUD

User management

Basic monitoring

Audit logs

Phase 2 (Operational)
Subscription management

Feature flags

Marketplace moderation

Webhook monitoring

Phase 3 (Advanced)
AI analytics dashboard

Predictive analytics

Advanced reporting

Custom integrations

💡 Key Features for Your App
Based on your test files, you specifically need:

Marketplace moderation dashboard - Approve/publish tests

Tenant resource monitoring - Track usage per tenant

Webhook delivery dashboard - Monitor webhook health

AI usage analytics - Track predictive analytics and rescue tests

Audit log viewer - Global audit trail

Would you like me to help you implement any specific super admin feature or create a migration for the admin tables?

prd for thsi super admin
📋 Product Requirements Document (PRD)
Super Admin Dashboard - TestMaster Platform
Document Status	Draft v1.0
Last Updated	2026-03-03
Product Owner	[Name]
Target Release	Q2 2026
1. Executive Summary
1.1 Purpose
The Super Admin Dashboard serves as the central command center for platform-wide administration of the TestMaster multi-tenant educational testing platform. It provides comprehensive oversight, management capabilities, and analytics across all tenants, users, and system components.

1.2 Product Vision
Empower platform administrators with a unified, intuitive interface to efficiently manage the entire TestMaster ecosystem while ensuring security, scalability, and optimal performance across all tenant instances.

1.3 Success Metrics
Tenant onboarding time reduced by 50%

System issue resolution time decreased by 40%

Platform uptime maintained at 99.9%

Admin task completion efficiency improved by 60%

2. User Personas
2.1 Primary Personas
Persona	Role	Goals	Pain Points
System Administrator Alex	Technical admin managing infrastructure	Monitor system health, troubleshoot issues, optimize performance	Scattered logs, no centralized monitoring
Operations Manager Olivia	Business ops overseeing tenants	Onboard tenants, manage subscriptions, handle billing	Manual tenant setup, billing complexity
Compliance Officer Carlos	Security/compliance lead	Audit trails, security monitoring, GDPR compliance	Limited visibility into user actions
Support Specialist Sam	Customer support	Impersonate users, view logs, resolve tickets	Cannot see across tenant boundaries
3. Functional Requirements
3.1 Authentication & Authorization
ID	Requirement	Priority	Acceptance Criteria
AUTH-01	Super admin login with MFA	P0	MFA required, SSO integration optional
AUTH-02	Role-based access control (RBAC)	P0	Granular permissions for sub-admin roles
AUTH-03	Session management	P1	View/logout active sessions
AUTH-04	IP whitelisting	P2	Restrict access to approved IPs
3.2 Dashboard Home (Overview)
ID	Requirement	Priority	Acceptance Criteria
DASH-01	Real-time platform stats	P0	Total tenants, active users, revenue MTD
DASH-02	System health indicators	P0	CPU, memory, queue status, API latency
DASH-03	Recent activities feed	P1	New tenants, failed payments, support tickets
DASH-04	Quick action toolbar	P1	Common tasks accessible from dashboard
DASH-05	Customizable widgets	P2	Admins can arrange dashboard layout
3.3 Tenant Management
ID	Requirement	Priority	Acceptance Criteria
TEN-01	Tenant directory with search/filter	P0	Sort by status, plan, date, usage
TEN-02	Tenant creation wizard	P0	Step-by-step setup with validation
TEN-03	Tenant details view	P0	Profile, settings, users, usage, billing
TEN-04	Tenant status management	P0	Activate, suspend, archive, delete
TEN-05	Tenant impersonation	P0	One-click login as tenant admin
TEN-06	Bulk tenant operations	P1	Export, update plan, send notifications
TEN-07	Tenant data export	P1	GDPR-compliant data export
TEN-08	Tenant backup/restore	P2	Manual backup and restoration
3.4 User Management
ID	Requirement	Priority	Acceptance Criteria
USR-01	Global user directory	P0	View all users across tenants
USR-02	User profile management	P0	Edit details, reset password, lock account
USR-03	User activity timeline	P1	Complete audit trail per user
USR-04	Bulk user operations	P1	Import, export, suspend multiple users
USR-05	Role management	P0	Create/edit roles and permissions
3.5 Subscription & Billing
ID	Requirement	Priority	Acceptance Criteria
BILL-01	Plan management	P0	Create, edit, archive pricing plans
BILL-02	Subscription overview	P0	All active subscriptions with status
BILL-03	Revenue dashboard	P1	MRR, ARR, churn rate, projections
BILL-04	Invoice management	P1	View, regenerate, email invoices
BILL-05	Payment processing	P1	Manual payments, refunds, failed retry
BILL-06	Coupon/discount system	P2	Create and track promotional codes
BILL-07	Usage-based billing	P2	Track and bill for API calls, storage
3.6 Marketplace Management
ID	Requirement	Priority	Acceptance Criteria
MKT-01	Listing approval queue	P0	Review, approve/reject test listings
MKT-02	Featured listings management	P1	Promote/demote marketplace items
MKT-03	Category management	P1	Create/edit marketplace categories
MKT-04	Revenue sharing reports	P1	Payout reports per tenant
MKT-05	Content moderation tools	P1	Flag/review inappropriate content
MKT-06	Marketplace analytics	P2	Downloads, purchases, trending items
3.7 AI & Analytics Oversight
ID	Requirement	Priority	Acceptance Criteria
AI-01	AI usage dashboard	P1	Token usage, cost per tenant
AI-02	Model performance metrics	P2	Accuracy, latency, fallback rates
AI-03	Predictive analytics view	P1	Student predictions across tenants
AI-04	Rescue test configuration	P2	Configure AI rescue test parameters
AI-05	Training data management	P2	View/audit AI training datasets
3.8 Webhook Management
ID	Requirement	Priority	Acceptance Criteria
WH-01	Webhook delivery log	P1	All webhook attempts with status
WH-02	Failed webhook retry	P1	Manual retry of failed webhooks
WH-03	Webhook endpoint registry	P2	View all registered endpoints
WH-04	Webhook analytics	P2	Success rates, latency, volume
3.9 System Monitoring
ID	Requirement	Priority	Acceptance Criteria
SYS-01	Real-time health dashboard	P0	Service status, alerts, incidents
SYS-02	Error log viewer	P0	Search/filter exceptions across platform
SYS-03	Queue monitoring	P1	Queue size, processing time, failures
SYS-04	Database performance	P1	Query performance, slow queries
SYS-05	Cache statistics	P2	Hit rates, memory usage
SYS-06	Scheduled job monitor	P1	Cron job status, last run, failures
3.10 Audit & Compliance
ID	Requirement	Priority	Acceptance Criteria
AUD-01	Global audit log	P0	Searchable log of all admin actions
AUD-02	Security event log	P1	Failed logins, permission changes
AUD-03	Data export requests	P1	Manage GDPR data requests
AUD-04	Compliance reports	P2	Generate SOC2, GDPR reports
AUD-05	Backup verification	P2	Backup status and test restoration
3.11 Feature Management
ID	Requirement	Priority	Acceptance Criteria
FEAT-01	Feature flag dashboard	P1	Toggle features globally or per tenant
FEAT-02	A/B testing console	P2	Configure and monitor experiments
FEAT-03	Maintenance mode	P1	Enable/disable with custom message
FEAT-04	Version management	P2	Track and rollback feature versions
3.12 Support Tools
ID	Requirement	Priority	Acceptance Criteria
SUP-01	Ticket overview	P1	All support tickets across tenants
SUP-02	Announcement system	P1	Send announcements to tenants/users
SUP-03	Knowledge base management	P2	Edit help center content
SUP-04	System notifications	P1	Broadcast important alerts
4. Non-Functional Requirements
4.1 Performance
Requirement	Target
Dashboard load time	< 2 seconds
Search response time	< 1 second
Concurrent admin users	Support 50+
Data export time	< 30 seconds for 10K records
4.2 Security
Requirement	Target
MFA enforcement	Required for all super admins
Session timeout	30 minutes inactivity
Audit retention	7 years
Data encryption	AES-256 at rest, TLS 1.3 in transit
4.3 Scalability
Requirement	Target
Tenant support	1,000+ tenants
User records	1M+ users
Log retention	90 days hot storage, 7 years cold
4.4 UX Requirements
Responsive design - Desktop-first, tablet-friendly

Dark mode support - Optional theme

Keyboard navigation - Full accessibility

Export formats - CSV, PDF, Excel

5. Technical Architecture
5.1 Stack Recommendations
text
Frontend:
- Vue.js/React with Tailwind CSS
- Chart.js/D3.js for analytics
- WebSockets for real-time updates

Backend:
- Laravel (existing) with Filament/Backpack
- Redis for caching/queues
- Elasticsearch for logs

Database:
- PostgreSQL (central DB)
- Separate tenant databases
- ClickHouse for analytics
5.2 API Endpoints Needed
text
GET    /api/v1/admin/stats
GET    /api/v1/admin/tenants
POST   /api/v1/admin/tenants
GET    /api/v1/admin/tenants/{id}
PUT    /api/v1/admin/tenants/{id}
DELETE /api/v1/admin/tenants/{id}
POST   /api/v1/admin/tenants/{id}/impersonate

GET    /api/v1/admin/users
GET    /api/v1/admin/audit-logs
GET    /api/v1/admin/marketplace/pending
POST   /api/v1/admin/marketplace/{id}/approve

GET    /api/v1/admin/system/health
GET    /api/v1/admin/system/logs
GET    /api/v1/admin/webhooks/failed
POST   /api/v1/admin/webhooks/{id}/retry
6. UI/UX Mockups
6.1 Dashboard Layout
text
┌─────────────────────────────────────────────────┐
│  TESTMASTER SUPER ADMIN                  [A] ▼  │
├─────────────────────────────────────────────────┤
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐        │
│ │24   │ │1,245│ │$12.4K│ │99.9%│ │128  │        │
│ │Ten- │ │Users│ │Revenue│ │Uptime│ │Queue │        │
│ │ants │ │     │ │       │ │     │ │     │        │
│ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘        │
│                                                  │
│ ┌────────────────────┐ ┌────────────────────┐   │
│ │ RECENT TENANTS     │ │ SYSTEM HEALTH      │   │
│ │ • Acme Corp (Active)│ │ CPU: █████░░ 45%   │   │
│ │ • TechStart (Active)│ │ Mem: ████░░░ 32%   │   │
│ │ • EduSchool (Susp.) │ │ Disk: ██████░ 60%  │   │
│ │ • Global Ltd (New)  │ │ Queue: 128 jobs    │   │
│ └────────────────────┘ └────────────────────┘   │
│                                                  │
│ ┌────────────────────┐ ┌────────────────────┐   │
│ │ PENDING ACTIONS    │ │ RECENT ERRORS      │   │
│ │ • 3 marketplace    │ │ • API timeout (5m) │   │
│ │ • 2 support tickets│ │ • DB deadlock (1h) │   │
│ │ • 5 failed payments│ │ • Auth failure (2h)│   │
│ └────────────────────┘ └────────────────────┘   │
└─────────────────────────────────────────────────┘
7. Implementation Phases
Phase 1: Core Foundation (Week 1-2)
Super admin authentication with MFA

Basic dashboard with stats

Tenant CRUD operations

Global user directory

Phase 2: Operations (Week 3-4)
Marketplace approval system

Subscription management

Basic monitoring dashboard

Audit log viewer

Phase 3: Advanced Features (Week 5-6)
AI usage dashboard

Webhook management console

Bulk operations

Advanced reporting

Phase 4: Polish & Scale (Week 7-8)
Performance optimizations

Customizable dashboard

API rate limiting

Documentation & training

8. Success Criteria
8.1 Release Criteria
All P0 requirements implemented

Test coverage > 80%

Security audit passed

Load testing completed (500 concurrent)

Documentation complete

8.2 Post-Launch Metrics
Admin task completion time reduced by 50%

Support tickets decreased by 30%

Tenant onboarding time < 15 minutes

NPS score > 40 from admins

9. Open Questions
Should we allow sub-admin roles with limited permissions?

Do we need white-labeling options for enterprise tenants?

What's the data retention policy for audit logs?

Should we build custom dashboard or use Filament/Backpack?

Do we need mobile app for admins?

10. Appendix
10.1 Related Documents
Technical Architecture Document

API Specification

Database Schema

Security Policy

10.2 Glossary
Tenant: An organization/customer using the platform

Super Admin: Platform-level administrator

Tenant Admin: Administrator of specific tenant

Marketplace: Public repository of tests

super-admin-dashboard/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Dashboard home
│   │   ├── tenants/
│   │   │   ├── page.tsx                 # Tenants list
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx             # Tenant details
│   │   │   │   └── edit/
│   │   │   │       └── page.tsx
│   │   │   └── create/
│   │   │       └── page.tsx
│   │   ├── users/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── marketplace/
│   │   │   ├── page.tsx
│   │   │   └── pending/
│   │   │       └── page.tsx
│   │   ├── monitoring/
│   │   │   ├── page.tsx
│   │   │   ├── logs/
│   │   │   │   └── page.tsx
│   │   │   └── webhooks/
│   │   │       └── page.tsx
│   │   └── settings/
│   │       ├── page.tsx
│   │       ├── plans/
│   │       │   └── page.tsx
│   │       └── features/
│   │           └── page.tsx
│   ├── api/
│   │   └── (backend proxy routes)/
│   ├── components/
│   │   ├── ui/                           # Reusable UI components
│   │   ├── layouts/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── StatsCards.tsx
│   │   ├── tenants/
│   │   │   ├── TenantTable.tsx
│   │   │   ├── TenantForm.tsx
│   │   │   └── TenantStatusBadge.tsx
│   │   ├── charts/
│   │   │   ├── RevenueChart.tsx
│   │   │   ├── UsageChart.tsx
│   │   │   └── SystemHealthChart.tsx
│   │   └── marketplace/
│   │       ├── ApprovalQueue.tsx
│   │       └── ListingCard.tsx
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts                 # Axios instance
│   │   │   ├── auth.ts                    # Auth API calls
│   │   │   ├── tenants.ts                  # Tenants API
│   │   │   ├── users.ts
│   │   │   ├── marketplace.ts
│   │   │   └── monitoring.ts
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useTenants.ts
│   │   │   └── useWebSocket.ts
│   │   ├── types/
│   │   │   ├── tenant.ts
│   │   │   ├── user.ts
│   │   │   └── api.ts
│   │   └── utils/
│   │       ├── formatters.ts
│   │       └── validators.ts
│   └── styles/
│       └── globals.css
├── public/
├── .env.local
├── next.config.js
├── tailwind.config.js
├── package.json
└── tsconfig.json
