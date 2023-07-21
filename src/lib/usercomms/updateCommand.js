export function updateCommand(bot, interaction) {
    const createOptions = interaction.data.options.filter(
	o => o.name == "create"
    )[0].options;

    const commandId = createOptions.filter(
	o => o.name == "command"
    )[0]["value"];

    bot.logger.debug(`Creating command for ${commandId}`);

    // Check if command name exists, if it does, complain
    // Otherwise present the modal

    const exists = usergameDB.searchCommand({name: commandId})

    if (exists.length == 0) {
	ackInteraction(
	    interaction,
	    "message",
	    {},
	    {
		content: `Command with name ${commandId} does not exist!`
	    }
	);
    }else {
	const commandUserId = exists[1];
	let userId;
	if (interaction.member) {
	    userId = `${interaction.member.id}`;
	}else {
	    userId = `${interaction.user.id}`;
	}
	if (userId == commandUserId) {
	    ackInteraction(
		interaction,
		"modal",
		{},
		{
		    customId: `usergame_${userId}_src_update`,
		    title: `${commandId}: Code Update`,
		    components: [{
			type: MessageComponentTypes.ActionRow,
			components: [{
			    type: MessageComponentTypes.InputText,
			    customId: `${commandId}`,
			    style: TextStyles.Paragraph,
			    label: "Source Code",
			    value: exists[6]
			}]	
		    }]
		}
	    );
	}else {
	    ackInteraction(
		interaction,
		"message",
		{},
		{
		    content: `You did not make ${commandId}`
		}
	    );
	}
    }
    return
}
