#include "commands.h"

CCORDcode interactions_upsert(struct discord* client, const struct discord_ready *event, struct discord_application_commands commands) {
  for (int i=0; i<commands.size; i++) {
    log_debug("Creating command: %s", commands.array[i].name);
  }
  struct discord_ret_application_commands ret = {
    .high_priority = true,
  };
  discord_bulk_overwrite_global_application_commands(client, event->application->id, &commands, &ret);
  return CCORD_OK;
}
