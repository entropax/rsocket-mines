from _weakrefset import WeakSet
from asyncio import Queue
from collections import defaultdict
from typing import Optional, Dict, Set
from weakref import WeakValueDictionary
from dataclasses import dataclass, field


class SessionId(str):
    pass

@dataclass()
class UserSessionData:
    username: str
    password: str
    session_id: SessionId

@dataclass()
class AppData:
    last_metadata_push: Optional[bytes] = None
    last_fire_and_forget: Optional[bytes] = None
    user_session_by_id: Dict[SessionId, UserSessionData] = field(default_factory=WeakValueDictionary)
@dataclass(frozen=True)
class RoomData:
    user_session_by_id: Dict[SessionId, UserSessionData] = field(default_factory=WeakValueDictionary)
    room_users: Dict[str, Set[SessionId]] = field(default_factory=lambda: defaultdict(WeakSet))
    room_messages: Dict[str, Queue] = field(default_factory=lambda: defaultdict(Queue))

@dataclass(frozen=True)
class Message:
    user: Optional[str] = None
    content: Optional[str] = None
    room: Optional[str] = None
