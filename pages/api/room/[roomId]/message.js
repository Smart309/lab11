import {
  readChatRoomsDB,
  writeChatRoomsDB,
} from "../../../../backendLibs/dbLib";
import { v4 as uuidv4 } from "uuid";
import { checkToken } from "../../../../backendLibs/checkToken";

export default function roomIdMessageRoute(req, res) {
  if (req.method === "GET") {
    //check token
    const username = checkToken(req);
    if (!username) {
      return res.status(401).json({
        ok: false,
        message: "You don't have permission to access this api",
      });
    }
    //get roomId from url
    const roomId = req.query.roomId;

    const rooms = readChatRoomsDB();

    //check if roomId exist
    const roomIdx = rooms.find((x) => x.roomId === roomId);
    if (roomIdx === undefined) {
      res.status(404).json({ ok: false, message: "Invalid room id" });
    } else {
      res.json({ ok: true, message: roomIdx.messages });
    }
    //find room and return
    //...
  } else if (req.method === "POST") {
    //check token
    const username = checkToken(req);
    if (!username) {
      return res.status(401).json({
        ok: false,
        message: "You don't have permission to access this api",
      });
    }
    //get roomId from url
    const roomId = req.query.roomId;
    const rooms = readChatRoomsDB();
    const text = req.body.text;
    //check if roomId exist
    const roomIdx = rooms.find((x) => x.roomId === roomId);
    if (roomIdx === undefined) {
      return res.status(404).json({ ok: false, message: "Invalid room id" });
    }
    const newId = uuidv4();
    const newMeg = {
      messageId: newId,
      text: text,
      username: username.username,
    };
    //validate body
    if (typeof req.body.text !== "string" || req.body.text.length === 0) {
      return res.status(400).json({ ok: false, message: "Invalid text input" });
    }
    //create message
    roomIdx.messages.push(newMeg);
    writeChatRoomsDB(rooms);
    return res.json({ ok: true, message: newMeg });
  }
}
