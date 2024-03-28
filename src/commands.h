#include "discord.h"
#include "discord_codecs.h"
#include <string.h>

#ifndef BOT_TOKEN
#define GET_BOT_TOKEN() getenv("BOT_TOKEN")
#else
#define GET_BOT_TOKEN() BOT_TOKEN
#endif

#define INTERACTION_CREATE(str, int_description, int_type, int_options) struct discord_create_global_application_command params_##str##_##int_type = { \
    .name = #str,							\
    .description = int_description,					\
    .type = int_type,							\
    .options = int_options,						\
  };									\
  discord_create_global_application_command(client, event->application->id, \
					    &params_##str##_##int_type, NULL)

#define INTERACTION_CALL(str, command) if (strcmp(event->data->name, str)==0) command(client, event)


void command_pong(struct discord *, const struct discord_interaction *event);

