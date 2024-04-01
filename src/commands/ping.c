#include "../commands.h"
#include <stdio.h>
#include <time.h>

void command_pong(struct discord *client, const struct discord_interaction *event) {
  u64snowflake time_sent = (event->id >> 22) + 1420070400000;
  struct timespec now;
  clock_gettime(CLOCK_REALTIME, &now);

  // This time sometimes is negative? idk if that's because of a
  // problem with my conversion (probably) or with time syncronization
  // between Discord's server etc.
  double diff = (now.tv_sec * 1000 + (double) now.tv_nsec / 1000000) - time_sent;

  char response[512];

  snprintf(&response[0], sizeof(response), "Pong! %.3g ms", diff);
  
  struct discord_interaction_response params = {
    .type = DISCORD_INTERACTION_CHANNEL_MESSAGE_WITH_SOURCE,
    .data = &(struct discord_interaction_callback_data){
      .content = &response[0]
    }
  };
  discord_create_interaction_response(client, event->id,
				      event->token, &params, NULL); 
}
