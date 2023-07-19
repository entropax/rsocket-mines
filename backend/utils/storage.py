import asyncio
from _weakrefset import WeakSet
from asyncio import Queue
from collections import defaultdict
from typing import Optional, Dict, Set, List
from weakref import WeakValueDictionary
from dataclasses import dataclass, field


class SessionId(str):
    pass

@dataclass()
class UserSessionData:
    username: str
    password: str
    session_id: SessionId
    new_messages: list[list[str, str, str]]


@dataclass()
class AppData:
    sessions: Dict = field(default_factory=dict)
    last_metadata_push: Optional[bytes] = None
    # user_session_by_id: Dict[SessionId, UserSessionData] = field(default_factory=WeakValueDictionary)
    user_session_by_id: Dict[SessionId, UserSessionData] = field(default_factory=WeakValueDictionary)
    last_messages: list[list[str, str, str]] = field(default_factory=list)


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
