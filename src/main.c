#include "discord_codecs.h"
#include <assert.h>
#include <string.h>
#include <discord.h>
// We want this: need to find a way to generate the include directory properly...
/* #include <concord/discord.h> */

#ifndef BOT_TOKEN
#error "BOT_TOKEN Not Defined"
#define BOT_TOKEN (assert(0), "No Bot Token Defined")
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
  struct discord *client = discord_init(BOT_TOKEN);
  discord_set_on_ready(client, &on_ready);
  discord_set_on_interaction_create(client, &on_interaction);
  discord_run(client);
}
