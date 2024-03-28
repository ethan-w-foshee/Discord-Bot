#include "discord_codecs.h"
#include <assert.h>
#include <string.h>
#include <stdlib.h>
#include <discord.h>

#ifndef BOT_TOKEN
#define GET_BOT_TOKEN() getenv("BOT_TOKEN")
#else
#define GET_BOT_TOKEN() (BOT_TOKEN)
#endif

void on_ready(struct discord *client, const struct discord_ready *event) {
  struct discord_create_global_application_command params = {
    .name = "ping",
    .description = "Ping command!"
  };
  discord_create_global_application_command(client, event->application->id,
					    &params, NULL);
}

void on_interaction(struct discord *client, const struct discord_interaction *event) {
  switch (event->type) {
  case DISCORD_INTERACTION_APPLICATION_COMMAND:
    if (strcmp(event->data->name, "ping") == 0) {
      struct discord_interaction_response params = {
	.type = DISCORD_INTERACTION_CHANNEL_MESSAGE_WITH_SOURCE,
	.data = &(struct discord_interaction_callback_data){
	  .content = "pong"
	}
      };
      discord_create_interaction_response(client, event->id,
					  event->token, &params, NULL);
    }
    break;
  default:
    break;
  }
}

int main(void) {
  struct discord *client = discord_init(GET_BOT_TOKEN());
  discord_set_on_ready(client, &on_ready);
  discord_set_on_interaction_create(client, &on_interaction);
  discord_run(client);
}
