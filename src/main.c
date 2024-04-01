#include "logging.h"
#include "commands.h"

void on_ready(struct discord *client, const struct discord_ready *event) {
  log_debug("I'm ready!!");
  INTERACTION_CREATE_START
  INTERACTION_CREATE(ping, "Ping Pong Time!", DISCORD_APPLICATION_CHAT_INPUT, NULL)
  INTERACTION_CREATE_END;
}

void on_interaction(struct discord *client, const struct discord_interaction *event) {
  switch (event->type) {
  case DISCORD_INTERACTION_APPLICATION_COMMAND:
    INTERACTION_CALL("ping", command_pong);
    break;
  default:
    break;
  }
}

int main(void) {
  starbot_configure_logging();
  log_trace("Connecting to discord...");
  struct discord *client = discord_init(GET_DISCORD_TOKEN());
  discord_set_on_ready(client, &on_ready);
  discord_set_on_interaction_create(client, &on_interaction);
  discord_run(client);
}
