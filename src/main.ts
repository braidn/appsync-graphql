import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { DynamoDB, UpdateItemInput } from "@aws-sdk/client-dynamodb";

type Note = {
  id: string;
  name: string;
  completed: boolean;
};

type AppSyncEvents = {
  info: {
    fieldName: string;
  };
  arguments: {
    noteId: string;
    note: Note;
  };
};

exports.handler = async (event: AppSyncEvents) => {
  switch (event.info.fieldName) {
    case "getNoteById":
      return await getNoteById(event.arguments.noteId);
    case "createNote":
      return await createNote(event.arguments.note);
    case "listNotes":
      return await listNotes();
    case "deleteNote":
      return await deleteNote(event.arguments.noteId);
    case "updateNote":
      return await updateNote(event.arguments.note);
    default:
      return null;
  }
};

const defaultParams = {
  TableName: process.env.NOTES_TABLE,
};

const ddb = new DynamoDB({});

async function createNote(note: Note) {
  const params = {
    ...defaultParams,
    Item: marshall(note),
  };

  try {
    await ddb.putItem(params);
    return note;
  } catch (err) {
    console.log("Error occured", err);
    return null;
  }
}

async function deleteNote(id: string) {
  const params = {
    ...defaultParams,
    Key: marshall({
      id,
    }),
  };

  try {
    await ddb.deleteItem(params);
    return id;
  } catch (err) {
    console.log("Error occured", err);
    return null;
  }
}

async function getNoteById(id: string) {
  const params = {
    ...defaultParams,
    Key: marshall({ id }),
  };

  try {
    const { Item } = await ddb.getItem(params);
    return Item ? unmarshall(Item) : undefined;
  } catch (err) {
    console.log("Error occured", err);
    return null;
  }
}

async function listNotes() {
  const params = {
    ...defaultParams,
  };

  try {
    const { Items } = await ddb.scan(params);
    return Items ? Items.map((item) => unmarshall(item)) : undefined;
  } catch (err) {
    console.log("Error occured", err);
    return null;
  }
}

async function updateNote(note: any) {
  let params: UpdateItemInput = {
    ...defaultParams,
    Key: {
      id: note.id,
    },
    UpdateExpression: "",
    ReturnValues: "UPDATED_NEW",
  };

  let prefix = "set ";
  Object.keys(note).forEach((attr: string) => {
    if (attr !== "id") {
      params["UpdateExpression"] += `${prefix}#${attr} = :{attr}`;
      params["ExpressionAttributeValues"]![`:${attr}`] = note[attr];
      params["ExpressionAttributeNames"]![`#${attr}`] = attr;
      prefix = ", ";
    }
  });

  console.log("Params: ", params);

  try {
    await ddb.updateItem(params);
    return note;
  } catch (err) {
    console.log("Error occured", err);
    return null;
  }
}
