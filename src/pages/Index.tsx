import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Icon from '@/components/ui/icon';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type: 'text' | 'image' | 'voice';
  imageUrl?: string;
}

interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  personality: string;
}

function Index() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState('');
  const [aiPersonality, setAiPersonality] = useState('Дружелюбный помощник');
  const [aiVoice, setAiVoice] = useState<File | null>(null);
  const [aiAvatar, setAiAvatar] = useState<File | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [chats] = useState<Chat[]>([
    {
      id: 1,
      name: 'AI Ассистент',
      avatar: '🤖',
      lastMessage: 'Привет! Чем могу помочь?',
      timestamp: '2 мин назад',
      unread: 2,
      personality: 'Дружелюбный помощник'
    },
    {
      id: 2,
      name: 'Креативный AI',
      avatar: '🎨',
      lastMessage: 'Создал для тебя новую картинку!',
      timestamp: '15 мин назад',
      unread: 0,
      personality: 'Креативный художник'
    },
    {
      id: 3,
      name: 'AI Наставник',
      avatar: '📚',
      lastMessage: 'Готов объяснить любую тему',
      timestamp: '1 час назад',
      unread: 1,
      personality: 'Мудрый учитель'
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Привет! Я твой AI-ассистент. Могу общаться текстом, голосом и создавать изображения для тебя! 🚀',
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: message,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        text: 'Получил твоё сообщение! Сейчас обрабатываю... ✨',
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const menuItems = [
    { icon: 'MessageSquare', label: 'Чаты', active: true },
    { icon: 'Settings', label: 'Настройки AI', active: false },
    { icon: 'User', label: 'Профиль', active: false },
    { icon: 'History', label: 'История', active: false },
    { icon: 'Image', label: 'Галерея', active: false },
    { icon: 'HelpCircle', label: 'Помощь', active: false }
  ];

  return (
    <div className="h-screen flex bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50 lg:hidden">
            <Icon name="Menu" size={24} />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SidebarContent menuItems={menuItems} />
        </SheetContent>
      </Sheet>

      <div className="hidden lg:block w-72 glass border-r border-white/20">
        <SidebarContent menuItems={menuItems} />
      </div>

      <div className="w-96 border-r border-white/20 glass hidden md:flex flex-col">
        <div className="p-6 border-b border-white/20">
          <h2 className="text-2xl font-bold gradient-text">Мои чаты</h2>
          <div className="mt-4 relative">
            <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск чатов..."
              className="pl-10 glass border-white/30"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {chats.map((chat) => (
              <Card
                key={chat.id}
                className={`p-4 mb-2 cursor-pointer transition-all hover:scale-[1.02] glass border-white/30 ${
                  selectedChat?.id === chat.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedChat(chat)}
              >
                <div className="flex items-start gap-3">
                  <div className="text-4xl">{chat.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold truncate">{chat.name}</h3>
                      <span className="text-xs text-muted-foreground">{chat.timestamp}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                        {chat.personality}
                      </span>
                      {chat.unread > 0 && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-white">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-white/20">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full gradient-purple text-white font-semibold">
                <Icon name="Plus" size={20} className="mr-2" />
                Новый чат
              </Button>
            </DialogTrigger>
            <DialogContent className="glass">
              <DialogHeader>
                <DialogTitle className="gradient-text text-xl">Создать новый чат</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label>Имя AI</Label>
                  <Input placeholder="Мой помощник" className="glass" />
                </div>
                <div>
                  <Label>Характер</Label>
                  <Textarea placeholder="Дружелюбный и креативный..." className="glass" />
                </div>
                <Button className="w-full gradient-purple text-white">Создать</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <div className="p-4 border-b border-white/20 glass flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{selectedChat.avatar}</div>
                <div>
                  <h3 className="font-semibold">{selectedChat.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse-glow"></span>
                    Онлайн
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="hover:scale-110 transition-transform">
                      <Icon name="Settings" size={20} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="gradient-text text-2xl">Настройки AI-персонажа</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 mt-4">
                      <div className="space-y-2">
                        <Label className="text-base">Характер AI</Label>
                        <Textarea
                          value={aiPersonality}
                          onChange={(e) => setAiPersonality(e.target.value)}
                          placeholder="Опишите характер вашего AI-помощника..."
                          className="glass min-h-[120px]"
                        />
                        <p className="text-xs text-muted-foreground">
                          Например: дружелюбный, креативный, мудрый, веселый
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-base">Внешность AI</Label>
                        <div className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center glass hover:border-primary transition-colors cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setAiAvatar(e.target.files?.[0] || null)}
                            className="hidden"
                            id="avatar-upload"
                          />
                          <label htmlFor="avatar-upload" className="cursor-pointer">
                            <Icon name="Upload" size={40} className="mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm font-medium">
                              {aiAvatar ? aiAvatar.name : 'Загрузить фото аватара'}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">PNG, JPG до 10MB</p>
                          </label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-base">Голос AI</Label>
                        <div className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center glass hover:border-primary transition-colors cursor-pointer">
                          <input
                            type="file"
                            accept="audio/*"
                            onChange={(e) => setAiVoice(e.target.files?.[0] || null)}
                            className="hidden"
                            id="voice-upload"
                          />
                          <label htmlFor="voice-upload" className="cursor-pointer">
                            <Icon name="Mic" size={40} className="mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm font-medium">
                              {aiVoice ? aiVoice.name : 'Загрузить образец голоса'}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">MP3, WAV до 5MB</p>
                          </label>
                        </div>
                      </div>

                      <Button className="w-full gradient-purple text-white font-semibold h-12">
                        <Icon name="Save" size={20} className="mr-2" />
                        Сохранить настройки
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="ghost" size="icon" className="hover:scale-110 transition-transform">
                  <Icon name="MoreVertical" size={20} />
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4 max-w-4xl mx-auto">
                {messages.map((msg, index) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 animate-slide-up ${
                      msg.sender === 'user' ? 'flex-row-reverse' : ''
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className={msg.sender === 'ai' ? 'gradient-purple text-white' : 'bg-accent'}>
                        {msg.sender === 'ai' ? '🤖' : '👤'}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`max-w-[70%] rounded-2xl p-4 glass ${
                        msg.sender === 'user'
                          ? 'bg-primary/20 border-primary/30'
                          : 'border-white/30'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <span className="text-xs text-muted-foreground mt-2 block">
                        {msg.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-white/20 glass">
              <div className="max-w-4xl mx-auto flex gap-2">
                <Button variant="ghost" size="icon" className="hover:scale-110 transition-transform">
                  <Icon name="Paperclip" size={20} />
                </Button>
                <Button variant="ghost" size="icon" className="hover:scale-110 transition-transform">
                  <Icon name="Image" size={20} />
                </Button>
                <Button variant="ghost" size="icon" className="hover:scale-110 transition-transform">
                  <Icon name="Mic" size={20} />
                </Button>
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Напишите сообщение..."
                  className="flex-1 glass border-white/30"
                />
                <Button
                  onClick={handleSendMessage}
                  className="gradient-purple text-white hover:scale-105 transition-transform"
                  size="icon"
                >
                  <Icon name="Send" size={20} />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4 animate-fade-in">
              <div className="text-6xl mb-4">💬</div>
              <h2 className="text-2xl font-bold gradient-text">Выберите чат</h2>
              <p className="text-muted-foreground">Начните общение с AI-ассистентом</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SidebarContent({ menuItems }: { menuItems: Array<{ icon: string; label: string; active: boolean }> }) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-white/20">
        <h1 className="text-2xl font-bold gradient-text">AI Messenger</h1>
        <p className="text-sm text-muted-foreground mt-1">Поехали! 🚀</p>
      </div>

      <div className="flex-1 p-4">
        <nav className="space-y-2">
          {menuItems.map((item, index) => (
            <Button
              key={index}
              variant={item.active ? 'default' : 'ghost'}
              className={`w-full justify-start ${
                item.active ? 'gradient-purple text-white' : ''
              } hover:scale-105 transition-transform`}
            >
              <Icon name={item.icon} size={20} className="mr-3" />
              {item.label}
            </Button>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-white/20">
        <div className="flex items-center gap-3 p-3 rounded-lg glass">
          <Avatar>
            <AvatarFallback className="gradient-purple text-white">U</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">Пользователь</p>
            <p className="text-xs text-muted-foreground">Онлайн</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;