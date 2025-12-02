import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    AppWindow,
    Database,
    ShieldAlert,
    Clock,
    Server,
    Cpu,
    HardDrive,
    Activity,
    Play,
    Square,
    Settings,
    Trash2,
    Plus,
    RefreshCw,
    Terminal,
    LogOut,
    MoreVertical,
    CheckCircle2,
    XCircle,
    Search,
    Save,
    Folder,
    FileText,
    File,
    ChevronRight,
    Home,
    Upload,
    Download,
    MoreHorizontal,
    Edit3,
    ArrowUp,
    Globe,
    Layers
} from 'lucide-react';

// --- Mock Data ---

// Renamed from MOCK_APPS to MOCK_SERVICES for clarity
const MOCK_SERVICES = [
    { id: 1, name: 'Nginx', version: '1.22.1', status: 'running', icon: 'N', description: '高性能 Web 服务器' },
    { id: 2, name: 'MySQL', version: '8.0.32', status: 'running', icon: 'M', description: '关系型数据库管理系统' },
    { id: 3, name: 'PHP-8.1', version: '8.1.18', status: 'stopped', icon: 'P', description: 'PHP 超文本预处理器' },
    { id: 4, name: 'Docker', version: '23.0.1', status: 'running', icon: 'D', description: '容器化应用平台' },
    { id: 5, name: 'Redis', version: '7.0.8', status: 'running', icon: 'R', description: '内存数据结构存储' },
    { id: 6, name: 'Pure-Ftpd', version: '1.0.51', status: 'stopped', icon: 'F', description: 'FTP 服务端' },
];

const MOCK_WEB_APPS = [
    { id: 1, domain: 'example.com', path: '/www/wwwroot/example.com', status: 'running', php: '8.1', ssl: '剩余 23 天', remarks: '企业官网' },
    { id: 2, domain: 'api.service.io', path: '/www/wwwroot/api', status: 'running', php: '8.2', ssl: '剩余 89 天', remarks: '核心接口' },
    { id: 3, domain: 'blog.dev.local', path: '/www/wwwroot/blog', status: 'stopped', php: '8.0', ssl: '未部署', remarks: '测试博客' },
];

const MOCK_DBS = [
    { id: 1, name: 'wordpress_main', user: 'wp_user', size: '128.5 MB', charset: 'utf8mb4', backup: '2023-10-27' },
    { id: 2, name: 'app_production', user: 'app_admin', size: '1.2 GB', charset: 'utf8mb4', backup: '2023-10-26' },
    { id: 3, name: 'test_db', user: 'root', size: '5.0 MB', charset: 'utf8', backup: '无备份' },
];

const MOCK_FIREWALL = [
    { id: 1, port: '80', protocol: 'TCP', action: '允许', source: '所有 IP', comment: 'Web 服务' },
    { id: 2, port: '443', protocol: 'TCP', action: '允许', source: '所有 IP', comment: 'HTTPS 服务' },
    { id: 3, port: '22', protocol: 'TCP', action: '允许', source: '192.168.1.0/24', comment: 'SSH 内网' },
    { id: 4, port: '3306', protocol: 'TCP', action: '拒绝', source: '所有 IP', comment: '数据库保护' },
];

const MOCK_CRON = [
    { id: 1, name: '续签 SSL 证书', cycle: '0 0 1 * *', nextRun: '2023-11-01 00:00:00', status: 'enabled', command: '/usr/bin/certbot renew' },
    { id: 2, name: '数据库备份', cycle: '0 2 * * *', nextRun: '2023-10-28 02:00:00', status: 'enabled', command: '/www/server/cron/backup_db.sh' },
    { id: 3, name: '清理临时文件', cycle: '0 3 * * 0', nextRun: '2023-10-29 03:00:00', status: 'disabled', command: 'rm -rf /tmp/*' },
];

const MOCK_FILES = [
    { id: 1, name: 'html', type: 'folder', size: '4.0 KB', permissions: '755', user: 'www', date: '2023-09-15 10:00' },
    { id: 2, name: 'public', type: 'folder', size: '4.0 KB', permissions: '755', user: 'www', date: '2023-10-01 11:20' },
    { id: 3, name: 'logs', type: 'folder', size: '4.0 KB', permissions: '755', user: 'www', date: '2023-10-27 09:15' },
    { id: 4, name: 'index.php', type: 'file', size: '2.4 KB', permissions: '644', user: 'www', date: '2023-10-26 16:45' },
    { id: 5, name: 'config.php', type: 'file', size: '1.2 KB', permissions: '644', user: 'www', date: '2023-10-25 14:30' },
    { id: 6, name: '.env', type: 'file', size: '546 B', permissions: '600', user: 'www', date: '2023-10-20 08:10' },
    { id: 7, name: 'README.md', type: 'file', size: '1.8 KB', permissions: '644', user: 'www', date: '2023-09-10 12:00' },
];

// --- Components ---

const ProgressBar = ({ percent, color = "bg-blue-600" }) => (
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div className={`${color} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${percent}%` }}></div>
    </div>
);

const StatusBadge = ({ status }) => {
    const isRunning = status === 'running' || status === 'enabled' || status === '允许';
    const color = isRunning ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    const dot = isRunning ? 'bg-green-500' : 'bg-red-500';

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      <span className={`w-1.5 h-1.5 mr-1.5 rounded-full ${dot}`}></span>
            {status === 'running' ? '运行中' : status === 'stopped' ? '已停止' : status}
    </span>
    );
};

const Card = ({ children, className = "" }) => (
    <div className={`bg-white rounded-lg border border-slate-200 shadow-sm ${className}`}>
        {children}
    </div>
);

export default function LinuxPanel() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [services, setServices] = useState(MOCK_SERVICES);
    const [webApps, setWebApps] = useState(MOCK_WEB_APPS);
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState(null);

    // File Manager State
    const [currentPath, setCurrentPath] = useState('/www/wwwroot/default');
    const [files, setFiles] = useState(MOCK_FILES);

    // Simulation of real-time data
    const [sysStats, setSysStats] = useState({ cpu: 23, ram: 45, load: 1.2 });

    useEffect(() => {
        const interval = setInterval(() => {
            setSysStats({
                cpu: Math.floor(Math.random() * (40 - 10) + 10),
                ram: 45 + Math.floor(Math.random() * 5),
                load: (Math.random() * 2).toFixed(2)
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const showNotification = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    };

    const toggleServiceStatus = (id) => {
        setIsLoading(true);
        setTimeout(() => {
            setServices(services.map(app => {
                if (app.id === id) {
                    const newStatus = app.status === 'running' ? 'stopped' : 'running';
                    showNotification(`${app.name} 已${newStatus === 'running' ? '启动' : '停止'}`);
                    return { ...app, status: newStatus };
                }
                return app;
            }));
            setIsLoading(false);
        }, 800);
    };

    const toggleWebAppStatus = (id) => {
        setIsLoading(true);
        setTimeout(() => {
            setWebApps(webApps.map(app => {
                if (app.id === id) {
                    const newStatus = app.status === 'running' ? 'stopped' : 'running';
                    showNotification(`${app.domain} 已${newStatus === 'running' ? '启动' : '停止'}`);
                    return { ...app, status: newStatus };
                }
                return app;
            }));
            setIsLoading(false);
        }, 800);
    };

    // Mock File Navigation
    const handleNavigate = (folderName) => {
        setIsLoading(true);
        // Simulate API delay
        setTimeout(() => {
            setCurrentPath(`${currentPath}/${folderName}`);
            setIsLoading(false);
        }, 300);
    };

    const handleUpLevel = () => {
        if (currentPath === '/') return;
        setIsLoading(true);
        setTimeout(() => {
            const newPath = currentPath.split('/').slice(0, -1).join('/') || '/';
            setCurrentPath(newPath);
            setIsLoading(false);
        }, 300);
    }

    // --- Views ---

    const DashboardView = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">CPU 使用率</p>
                            <h3 className="text-2xl font-bold text-slate-800 mt-1">{sysStats.cpu}%</h3>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-full">
                            <Cpu className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <ProgressBar percent={sysStats.cpu} color={sysStats.cpu > 80 ? 'bg-red-500' : 'bg-blue-600'} />
                        <p className="text-xs text-slate-400 mt-2">12 核心 Intel Xeon</p>
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">内存使用率</p>
                            <h3 className="text-2xl font-bold text-slate-800 mt-1">{sysStats.ram}%</h3>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-full">
                            <Activity className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <ProgressBar percent={sysStats.ram} color="bg-purple-600" />
                        <p className="text-xs text-slate-400 mt-2">14.2GB / 32GB 可用</p>
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">磁盘空间</p>
                            <h3 className="text-2xl font-bold text-slate-800 mt-1">68%</h3>
                        </div>
                        <div className="p-3 bg-emerald-50 rounded-full">
                            <HardDrive className="w-6 h-6 text-emerald-600" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <ProgressBar percent={68} color="bg-emerald-600" />
                        <p className="text-xs text-slate-400 mt-2">156GB / 500GB (NVMe)</p>
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">系统负载</p>
                            <h3 className="text-2xl font-bold text-slate-800 mt-1">{sysStats.load}</h3>
                        </div>
                        <div className="p-3 bg-orange-50 rounded-full">
                            <Server className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                            <span>1分钟</span>
                            <span>5分钟</span>
                            <span>15分钟</span>
                        </div>
                        <div className="flex space-x-1 h-2.5">
                            <div className="flex-1 bg-orange-200 rounded-l-full relative overflow-hidden">
                                <div className="absolute top-0 bottom-0 left-0 bg-orange-500" style={{width: '40%'}}></div>
                            </div>
                            <div className="flex-1 bg-orange-200 relative overflow-hidden">
                                <div className="absolute top-0 bottom-0 left-0 bg-orange-400" style={{width: '30%'}}></div>
                            </div>
                            <div className="flex-1 bg-orange-200 rounded-r-full relative overflow-hidden">
                                <div className="absolute top-0 bottom-0 left-0 bg-orange-300" style={{width: '20%'}}></div>
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">运行时间: 124天 5小时</p>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">流量监控 (Mock)</h3>
                    <div className="h-64 flex items-end justify-between space-x-2 px-2">
                        {[...Array(24)].map((_, i) => (
                            <div key={i} className="w-full bg-blue-100 rounded-t-sm relative group">
                                <div
                                    className="absolute bottom-0 w-full bg-blue-500 rounded-t-sm transition-all duration-300 group-hover:bg-blue-600"
                                    style={{ height: `${Math.random() * 80 + 10}%` }}
                                ></div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 mt-2">
                        <span>00:00</span>
                        <span>06:00</span>
                        <span>12:00</span>
                        <span>18:00</span>
                        <span>23:59</span>
                    </div>
                </Card>

                <Card className="p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">系统信息</h3>
                    <ul className="space-y-4">
                        <li className="flex justify-between text-sm">
                            <span className="text-slate-500">操作系统</span>
                            <span className="font-medium text-slate-800">CentOS 7.9.2009</span>
                        </li>
                        <li className="flex justify-between text-sm">
                            <span className="text-slate-500">内核版本</span>
                            <span className="font-medium text-slate-800">3.10.0-1160</span>
                        </li>
                        <li className="flex justify-between text-sm">
                            <span className="text-slate-500">面板版本</span>
                            <span className="font-medium text-slate-800">v8.0.2 Free</span>
                        </li>
                        <li className="flex justify-between text-sm">
                            <span className="text-slate-500">当前时间</span>
                            <span className="font-medium text-slate-800">2023-10-27 14:30:05</span>
                        </li>
                    </ul>

                    <div className="mt-8 pt-6 border-t border-slate-100">
                        <button className="w-full flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-900 text-white py-2 rounded-md transition-colors">
                            <Terminal size={16} />
                            <span>打开 SSH 终端</span>
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );

    // New: Web Apps View (Website Management)
    const WebAppsView = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">Web 应用 (网站管理)</h2>
                <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors text-sm">
                    <Plus size={16} />
                    <span>添加站点</span>
                </button>
            </div>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                        <tr>
                            <th className="px-6 py-4 font-semibold">域名 / 备注</th>
                            <th className="px-6 py-4 font-semibold">状态</th>
                            <th className="px-6 py-4 font-semibold">根目录</th>
                            <th className="px-6 py-4 font-semibold">PHP版本</th>
                            <th className="px-6 py-4 font-semibold">SSL证书</th>
                            <th className="px-6 py-4 font-semibold text-right">操作</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                        {webApps.map((app) => (
                            <tr key={app.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-slate-800">{app.domain}</span>
                                        <span className="text-xs text-slate-400">{app.remarks}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={app.status} />
                                </td>
                                <td className="px-6 py-4 text-slate-500 font-mono text-xs">{app.path}</td>
                                <td className="px-6 py-4 text-slate-600">
                                    <span className="bg-slate-100 px-2 py-1 rounded text-xs">PHP-{app.php}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-1">
                                        {app.ssl === '未部署' ? (
                                            <span className="text-slate-400 text-xs">未部署</span>
                                        ) : (
                                            <span className="text-green-600 text-xs flex items-center">
                                <ShieldAlert size={12} className="mr-1"/> {app.ssl}
                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end space-x-3">
                                        <button className="text-blue-600 hover:text-blue-800 font-medium text-xs">设置</button>
                                        <button className="text-slate-500 hover:text-slate-700 font-medium text-xs">目录</button>
                                        <button
                                            className={`font-medium text-xs ${app.status === 'running' ? 'text-red-600' : 'text-green-600'}`}
                                            onClick={() => toggleWebAppStatus(app.id)}
                                        >
                                            {app.status === 'running' ? '停止' : '启动'}
                                        </button>
                                        <button className="text-red-500 hover:text-red-700" onClick={() => showNotification("模拟删除站点")}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );

    // Renamed: ServicesView (Previously AppsView)
    const ServicesView = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">服务管理</h2>
                <div className="flex space-x-2">
                    <button className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-md transition-colors text-sm">
                        <RefreshCw size={16} />
                        <span>刷新状态</span>
                    </button>
                    <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors text-sm">
                        <Plus size={16} />
                        <span>安装服务</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                    <Card key={service.id} className="p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-xl font-bold text-slate-600">
                                    {service.icon}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">{service.name}</h3>
                                    <p className="text-xs text-slate-500 font-mono">v{service.version}</p>
                                </div>
                            </div>
                            <StatusBadge status={service.status} />
                        </div>
                        <p className="text-sm text-slate-500 mb-6 h-10 line-clamp-2">{service.description}</p>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                            <button className="text-slate-500 hover:text-slate-700 text-sm flex items-center space-x-1">
                                <Settings size={14} />
                                <span>配置</span>
                            </button>
                            <div className="flex space-x-2">
                                {service.status === 'running' ? (
                                    <button
                                        onClick={() => toggleServiceStatus(service.id)}
                                        disabled={isLoading}
                                        className="flex items-center space-x-1 text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded text-xs font-medium transition-colors"
                                    >
                                        <Square size={12} fill="currentColor" />
                                        <span>停止</span>
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => toggleServiceStatus(service.id)}
                                        disabled={isLoading}
                                        className="flex items-center space-x-1 text-green-600 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded text-xs font-medium transition-colors"
                                    >
                                        <Play size={12} fill="currentColor" />
                                        <span>启动</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );

    const DatabaseView = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">数据库管理</h2>
                <div className="flex space-x-3">
                    <button className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-md transition-colors text-sm">
                        <RefreshCw size={16} />
                        <span>phpMyAdmin</span>
                    </button>
                    <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors text-sm">
                        <Plus size={16} />
                        <span>添加数据库</span>
                    </button>
                </div>
            </div>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                        <tr>
                            <th className="px-6 py-4 font-semibold">数据库名</th>
                            <th className="px-6 py-4 font-semibold">用户名</th>
                            <th className="px-6 py-4 font-semibold">字符集</th>
                            <th className="px-6 py-4 font-semibold">大小</th>
                            <th className="px-6 py-4 font-semibold">备份</th>
                            <th className="px-6 py-4 font-semibold text-right">操作</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                        {MOCK_DBS.map((db) => (
                            <tr key={db.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-800">{db.name}</td>
                                <td className="px-6 py-4 text-slate-600">{db.user}</td>
                                <td className="px-6 py-4 text-slate-600">
                                    <span className="bg-slate-100 px-2 py-1 rounded text-xs text-slate-600">{db.charset}</span>
                                </td>
                                <td className="px-6 py-4 text-slate-600">{db.size}</td>
                                <td className="px-6 py-4 text-slate-600">
                                    {db.backup !== '无备份' ? (
                                        <span className="flex items-center text-green-600 text-xs">
                             <CheckCircle2 size={12} className="mr-1"/> {db.backup}
                        </span>
                                    ) : (
                                        <span className="text-slate-400 text-xs">无备份</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end space-x-3">
                                        <button className="text-blue-600 hover:text-blue-800 font-medium text-xs">管理</button>
                                        <button className="text-blue-600 hover:text-blue-800 font-medium text-xs">备份</button>
                                        <button className="text-red-500 hover:text-red-700" onClick={() => showNotification("模拟删除数据库")}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );

    const FirewallView = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">防火墙</h2>
                    <p className="text-sm text-slate-500 mt-1">状态: <span className="text-green-600 font-medium">运行中</span> (UFW/Firewalld)</p>
                </div>
                <div className="flex space-x-2 w-full md:w-auto">
                    <input type="text" placeholder="放行端口 (如 8080)" className="border border-slate-300 rounded px-3 py-2 text-sm w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm whitespace-nowrap" onClick={() => showNotification("规则添加成功")}>
                        放行
                    </button>
                </div>
            </div>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                        <tr>
                            <th className="px-6 py-4 font-semibold">端口</th>
                            <th className="px-6 py-4 font-semibold">协议</th>
                            <th className="px-6 py-4 font-semibold">行为</th>
                            <th className="px-6 py-4 font-semibold">来源</th>
                            <th className="px-6 py-4 font-semibold">备注</th>
                            <th className="px-6 py-4 font-semibold text-right">操作</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                        {MOCK_FIREWALL.map((rule) => (
                            <tr key={rule.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-800">{rule.port}</td>
                                <td className="px-6 py-4 text-slate-600">{rule.protocol}</td>
                                <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${rule.action === '允许' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {rule.action}
                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-600 text-xs font-mono">{rule.source}</td>
                                <td className="px-6 py-4 text-slate-500">{rule.comment}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-red-500 hover:text-red-700" onClick={() => showNotification("规则删除成功")}>
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );

    const CronView = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">计划任务 (Crontab)</h2>
                <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors text-sm">
                    <Plus size={16} />
                    <span>添加任务</span>
                </button>
            </div>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                        <tr>
                            <th className="px-6 py-4 font-semibold">任务名称</th>
                            <th className="px-6 py-4 font-semibold">周期</th>
                            <th className="px-6 py-4 font-semibold">脚本/命令</th>
                            <th className="px-6 py-4 font-semibold">下次执行</th>
                            <th className="px-6 py-4 font-semibold">状态</th>
                            <th className="px-6 py-4 font-semibold text-right">操作</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                        {MOCK_CRON.map((job) => (
                            <tr key={job.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-800">{job.name}</td>
                                <td className="px-6 py-4 text-slate-600">
                                    <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded font-mono text-xs">{job.cycle}</span>
                                </td>
                                <td className="px-6 py-4 text-slate-500 font-mono text-xs max-w-xs truncate" title={job.command}>{job.command}</td>
                                <td className="px-6 py-4 text-slate-600">{job.nextRun}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-2">
                                        <div className={`w-8 h-4 rounded-full p-0.5 cursor-pointer transition-colors ${job.status === 'enabled' ? 'bg-blue-600' : 'bg-slate-300'}`}>
                                            <div className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform ${job.status === 'enabled' ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end space-x-3">
                                        <button className="text-slate-400 hover:text-slate-600" title="编辑">
                                            <Settings size={16} />
                                        </button>
                                        <button className="text-slate-400 hover:text-slate-600" title="日志">
                                            <Server size={16} />
                                        </button>
                                        <button className="text-red-500 hover:text-red-700" title="删除">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-sm text-yellow-800">
                <p className="font-bold flex items-center mb-1"><ShieldAlert size={16} className="mr-2"/> 注意事项</p>
                <p>任务执行日志保存在 /var/log/cron。请确保脚本具有可执行权限 (chmod +x)。</p>
            </div>
        </div>
    );

    const FilesView = () => (
        <div className="space-y-4 animate-in fade-in duration-500 h-full flex flex-col">
            {/* Breadcrumbs & Toolbar */}
            <div className="flex flex-col md:flex-row justify-between gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex flex-1 items-center space-x-2 overflow-hidden">
                    <button onClick={() => setCurrentPath('/')} className="p-1 hover:bg-slate-100 rounded text-slate-500"><Home size={18} /></button>
                    <div className="flex items-center text-sm text-slate-600 font-mono overflow-x-auto whitespace-nowrap scrollbar-hide">
                        {currentPath.split('/').filter(Boolean).map((part, index, arr) => (
                            <React.Fragment key={index}>
                                <ChevronRight size={14} className="mx-1 text-slate-400 flex-shrink-0" />
                                <span
                                    className={`cursor-pointer hover:text-blue-600 hover:underline ${index === arr.length - 1 ? 'font-bold text-slate-800' : ''}`}
                                    onClick={() => {
                                        const newPath = '/' + arr.slice(0, index + 1).join('/');
                                        setCurrentPath(newPath);
                                    }}
                                >
                                {part}
                            </span>
                            </React.Fragment>
                        ))}
                        {currentPath === '/' && <span className="font-bold text-slate-800 ml-1">/</span>}
                    </div>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                    <button onClick={handleUpLevel} className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors" disabled={currentPath === '/'}>
                        <ArrowUp size={16} />
                        <span className="hidden sm:inline">上级</span>
                    </button>
                    <button className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors">
                        <RefreshCw size={16} />
                    </button>
                    <div className="h-6 w-px bg-slate-300 mx-1"></div>
                    <button className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors shadow-sm">
                        <Upload size={16} />
                        <span className="hidden sm:inline">上传</span>
                    </button>
                    <button className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-slate-800 hover:bg-slate-900 text-white rounded transition-colors shadow-sm">
                        <Plus size={16} />
                        <span className="hidden sm:inline">新建</span>
                    </button>
                </div>
            </div>

            {/* File List */}
            <Card className="flex-1 overflow-hidden flex flex-col min-h-[500px]">
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase sticky top-0 z-10 shadow-sm">
                        <tr>
                            <th className="px-4 py-3 font-semibold w-8"><input type="checkbox" className="rounded" /></th>
                            <th className="px-4 py-3 font-semibold">文件名</th>
                            <th className="px-4 py-3 font-semibold w-24">大小</th>
                            <th className="px-4 py-3 font-semibold w-24">权限</th>
                            <th className="px-4 py-3 font-semibold w-24">所有者</th>
                            <th className="px-4 py-3 font-semibold w-36">修改时间</th>
                            <th className="px-4 py-3 font-semibold text-right w-48">操作</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                        {/* Go Up Row (optional visual helper) */}
                        {currentPath !== '/' && (
                            <tr className="hover:bg-slate-50 cursor-pointer" onClick={handleUpLevel}>
                                <td className="px-4 py-3 text-center"></td>
                                <td className="px-4 py-3 font-medium text-slate-800 flex items-center space-x-3">
                                    <div className="text-yellow-500"><Folder size={20} fill="currentColor" className="text-yellow-100 stroke-yellow-500" /></div>
                                    <span className="text-slate-500">..</span>
                                </td>
                                <td className="px-4 py-3"></td>
                                <td className="px-4 py-3"></td>
                                <td className="px-4 py-3"></td>
                                <td className="px-4 py-3"></td>
                                <td className="px-4 py-3"></td>
                            </tr>
                        )}

                        {files.map((file) => (
                            <tr key={file.id} className="group hover:bg-blue-50/50 transition-colors">
                                <td className="px-4 py-3 text-center"><input type="checkbox" className="rounded border-slate-300" /></td>
                                <td className="px-4 py-3 font-medium text-slate-800 cursor-pointer select-none" onClick={() => file.type === 'folder' && handleNavigate(file.name)}>
                                    <div className="flex items-center space-x-3">
                                        {file.type === 'folder' ? (
                                            <div className="text-yellow-500"><Folder size={20} fill="currentColor" className="text-yellow-100 stroke-yellow-500" /></div>
                                        ) : (
                                            <div className="text-slate-400"><FileText size={20} /></div>
                                        )}
                                        <span className={`${file.type === 'folder' ? 'text-blue-900 font-semibold' : 'text-slate-700'}`}>{file.name}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-slate-500 font-mono text-xs">{file.size}</td>
                                <td className="px-4 py-3 text-slate-500 font-mono text-xs cursor-pointer hover:bg-slate-200 inline-block rounded px-1">{file.permissions}</td>
                                <td className="px-4 py-3 text-slate-500 text-xs">{file.user}</td>
                                <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{file.date}</td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {file.type === 'file' && (
                                            <button className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-100 rounded" title="编辑">
                                                <Edit3 size={14} />
                                            </button>
                                        )}
                                        <button className="p-1.5 text-slate-500 hover:text-green-600 hover:bg-green-100 rounded" title="下载">
                                            <Download size={14} />
                                        </button>
                                        <button className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded" title="更多">
                                            <MoreHorizontal size={14} />
                                        </button>
                                        <button className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-100 rounded" title="删除" onClick={(e) => { e.stopPropagation(); showNotification("模拟删除成功"); }}>
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div className="bg-slate-50 px-4 py-2 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
                    <span>共 {files.length} 个项目</span>
                    <span>{currentPath}</span>
                </div>
            </Card>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">

            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex-col fixed h-full hidden md:flex z-10">
                <div className="h-16 flex items-center px-6 border-b border-slate-800">
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center mr-3 font-bold text-lg shadow-lg shadow-blue-900/50">L</div>
                    <span className="font-bold text-lg tracking-wide">LinuxPanel</span>
                </div>

                <nav className="flex-1 py-6 space-y-1 px-3">
                    {[
                        { id: 'dashboard', icon: LayoutDashboard, label: '概览' },
                        { id: 'webapps', icon: Globe, label: '应用管理' }, // New Web Apps (Websites)
                        { id: 'services', icon: Layers, label: '服务管理' }, // Old Apps (System Services)
                        { id: 'database', icon: Database, label: '数据库' },
                        { id: 'firewall', icon: ShieldAlert, label: '安全防火墙' },
                        { id: 'cron', icon: Clock, label: '计划任务' },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                                activeTab === item.id
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                        >
                            <item.icon size={20} />
                            <span className="font-medium">{item.label}</span>
                        </button>
                    ))}

                    <div className="pt-6 mt-6 border-t border-slate-800">
                        <div className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">系统工具</div>
                        <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                            <Settings size={20} />
                            <span>面板设置</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('files')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                                activeTab === 'files'
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                        >
                            <Server size={20} />
                            <span>文件管理</span>
                        </button>
                    </div>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button className="flex items-center space-x-2 text-slate-400 hover:text-white text-sm transition-colors w-full">
                        <LogOut size={16} />
                        <span>退出登录</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Header Placeholder (Visible only on small screens) */}
            <div className="md:hidden fixed w-full h-14 bg-slate-900 z-20 flex items-center justify-between px-4 text-white">
                <span className="font-bold">LinuxPanel</span>
                <button className="p-2"><MoreVertical size={20}/></button>
            </div>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8">
                {/* Top Bar */}
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            {activeTab === 'dashboard' && '系统概览'}
                            {activeTab === 'webapps' && 'Web 应用管理'}
                            {activeTab === 'services' && '服务管理'}
                            {activeTab === 'database' && '数据库管理'}
                            {activeTab === 'firewall' && '安全防火墙'}
                            {activeTab === 'cron' && '计划任务'}
                            {activeTab === 'files' && '文件资源管理器'}
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">欢迎回来，Administrator</p>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="hidden md:flex items-center bg-white border border-slate-200 rounded-full px-4 py-1.5 shadow-sm">
                            <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                            <span className="text-xs font-medium text-slate-600">系统运行正常</span>
                        </div>
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16}/>
                            <input type="text" placeholder="搜索..." className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 w-64 transition-all" />
                        </div>
                    </div>
                </header>

                {/* Dynamic Content Area */}
                <div className="min-h-[500px]">
                    {activeTab === 'dashboard' && <DashboardView />}
                    {activeTab === 'webapps' && <WebAppsView />}
                    {activeTab === 'services' && <ServicesView />}
                    {activeTab === 'database' && <DatabaseView />}
                    {activeTab === 'firewall' && <FirewallView />}
                    {activeTab === 'cron' && <CronView />}
                    {activeTab === 'files' && <FilesView />}
                </div>
            </main>

            {/* Notification Toast */}
            {notification && (
                <div className="fixed bottom-6 right-6 bg-slate-800 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3 animate-in slide-in-from-bottom-5 duration-300 z-50">
                    <CheckCircle2 className="text-green-400" size={20} />
                    <span className="text-sm font-medium">{notification}</span>
                </div>
            )}

        </div>
    );
}