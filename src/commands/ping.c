#include "../commands.h"
#include <stdio.h>
#include <time.h>

void command_pong(struct discord *client, const struct discord_interaction *event) {
  u64snowflake time_sent = event->id / 4194304 + 1420070400000;
  struct timespec now;
  clock_gettime(CLOCK_REALTIME, &now);

  u64snowflake diff = time_sent - (now.tv_sec * 1000 + now.tv_nsec / 1000);

  char response[512];

  sprintf(&response[0], "Pong! %llu ms", diff);
  
  struct discord_interaction_response params = {
    .type = DISCORD_INTERACTION_CHANNEL_MESSAGE_WITH_SOURCE,
    .data = &(struct discord_interaction_callback_data){
      .content = "pong"
    }
  };
  discord_create_interaction_response(client, event->id,
				      event->token, &params, NULL); 
}
