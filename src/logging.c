#include "logging.h"
#include <sqlite3.h>

void starbot_log_sqlite(log_Event *event) {
}

void starbot_configure_logging(void) {
  log_add_callback(&starbot_log_sqlite, NULL, LOG_ERROR);
}
