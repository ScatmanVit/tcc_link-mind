import './style.css'

import listUsers from '@/services/admin/admin.listUsers'
import createUser from '@/services/admin/admin.createUser'
import deleteUser from '@/services/admin/admin.deleteUser'
import updateUser from '@/services/admin/admin.updateUser'
import logout_Admin from '@/services/admin/admin.logout'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'

import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import Spinner from '@/components/ui/Spinner'
import EmailModal from '@/components/EmailModal'

import { useAuth } from '@/context/AuthContext'

export type User = {
	id: string
	name: string
	email: string,
	password?: string,
	is_active: boolean,
	role: string,
	status?: boolean,
	isVisible?: boolean
}

function ActionsModal({
	user,
	onClose,
	onEdit,
	onEmail,
	onDelete,
}: {
	user: User | null
	onClose: () => void
	onEdit: (user: User) => void
	onEmail: (user: User) => void
	onDelete: (id: string) => void
}) {
	if (!user) return null

	const handleEdit = () => {
		onEdit(user) 
		onClose()
	}

	const handleEmail = () => {
		onEmail(user)
		onClose()
	}

	const { access_token } = useAuth()

	async function handleDelete() {
		if (!access_token || !user?.id) {
			console.log("Sem token ou ID para usar")
			return null
		}
		try {
			const response = await deleteUser(access_token, user.id);
			if (response) {
				onClose()
				setTimeout(() => {
					onDelete(user.id)
				}, 500)
				console.log("Usuário deletado:", response);
			}
		
		} catch (err: any) {
			console.error(err.message || "Deu erro ao deletar")
		}
	}

	return (
		<Modal open={!!user} onClose={onClose} title={`Ações para ${user.name}`}>
			<div className="actions-modal-body">
				<Button onClick={handleEdit} className="full-width">Editar Usuário</Button>
				<Button onClick={handleEmail} className="full-width ghost">Enviar Email</Button>
				<Button onClick={handleDelete} className="full-width danger">Excluir Usuário</Button>
			</div>
		</Modal>
	)
}

export default function UsersPage() {

	const [users, setUsers] = useState<User[]>([])
	const [user, setUser] = useState({})
	const [q, setQ] = useState('')
	const [editingUser, setEditingUser] = useState<User | null>(null)
	const [isCreating, setIsCreating] = useState(false)
	const [userToEmail, setUserToEmail] = useState<User | null>(null)
	const [actionUser, setActionUser] = useState<User | null>(null)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | undefined>()
	const { logout, access_token } = useAuth()
	const [searchParams, setSearchParams] = useSearchParams();

	const page = searchParams.get("page") || "1";
	const limit = searchParams.get("limit") || "25";
	
		async function fetchUsers() {
			if (!access_token) {
				setError("Token não encontrado. Faça login novamente.");
				return;
			}
			try {
				const data = await listUsers(page, limit, access_token);
				console.log("Chamou de novo")
				setUsers(data.users);
			} catch (err: any) {
				console.error(err);
				setError(err.message || "Erro ao carregar usuários");
			} finally {
				setIsLoading(false);
			}
		}

	useEffect(() => {
		setIsLoading(true);

		fetchUsers();
	}, [searchParams, access_token]);

	function handleNextPage() {
		setSearchParams({
			page: (Number(page) + 1).toString(), 
			limit
		}); 
	};

	function handlePreviusPage() {
		if (Number(page) > 1) {
			setSearchParams({
				page: (Number(page) - 1).toString(), limit
			})
		}
	}

	function searchUser(searchTerm: string) {
		setUsers(prev =>
			prev.map(user => ({
				...user,
				isVisible: user.name.toLowerCase().includes(searchTerm.toLowerCase()) // se corresponder ao usuário da iteração atual ele muda para true se não para false
			}))
		);
	}
	useEffect(() => {
		searchUser(q)
	}, [q])


	function handleDeleteUser(id: string) {
		setUsers(prevUsers => prevUsers.filter(u => u.id !== id));
	}

	function handleEditUser(user: User) {
		setEditingUser(user)
	}

	function handleUserUpdated() {
		console.log("Acessou!")
		fetchUsers()
	}

	function handleUserCreated(newUser: User) {
		setUsers(prevUsers => [...prevUsers, newUser]);
	}

	async function handlerLogoutAdmin() {
		try {
			const res = await logout_Admin({ logout })
			if (res?.message) {
				console.log(res.message)
			}
		}  catch (err: any) {
			console.error(err.message)
		}
	} 

	const openCreateModal = () => setIsCreating(true)
	const openEmailModal = (user: User) => setUserToEmail(user)
	const openActionsModal = (user: User) => setActionUser(user)

	const closeSubModal = () => {
		setIsCreating(false)
		setEditingUser(null)
		setUserToEmail(null)
	}

	return (
		<div className="container">
			<div className="card">
				<div className="page-header">
					<div className="row">
						<div className="brand">PAINEL DO ADMINISTRADOR</div>
						<div className="space" />
						<Button className="ghost" onClick={handlerLogoutAdmin}>Sair</Button>
					</div>
				</div>
				<div className="toolbar">
					<Input
						placeholder="Buscar por nome ou email"
						value={q}
						onChange={e => setQ(e.target.value)}
						style={{ minWidth: 280 }}
					/>
					<div className="space" />
					<Button onClick={openCreateModal}>Novo Usuário</Button>
				</div>

				<div style={{ padding: 12 }}>
					{error && (
						<div className="tag red" style={{ margin: 20 }}>{error}</div>
					)}
					{isLoading ? (
						<div style={{ display: 'grid', placeItems: 'center', padding: 20 }}><Spinner size={22} /></div>
					) : !users.length ? (
						<div className="tag gray" style={{ margin: 20 }}>Nenhum usuário encontrado</div>
					) : (
						<div className="table-wrapper">
							<table className="table" role="grid">
								<thead>
									<tr>
										<th>ID</th>
										<th>Nome</th>
										<th>Email</th>
										<th>Role</th>
										<th>Status</th>
										<th className="sticky-col" style={{ width: 50 }}></th>
									</tr>
								</thead>
								<tbody>
									{users
										.filter(user => user.isVisible !== false)
										.map(user => (
										<tr key={user.id}>
											<td>{user.id.substring(0, 8)}...</td>
											<td>{user.name}</td>
											<td>{user.email}</td>
											<td>{user.role}</td>
											<td>
												<span className={"tag " +
													(user.is_active ? 'green' : 'gray')}>{user.is_active ? 'Ativo' : 'Inativo'}
												</span>
											</td>
											<td className="sticky-col">
												<Button
													className="ghost"
													onClick={() => openActionsModal(user)}>...</Button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}

					<div className="row" style={{ justifyContent: 'center', paddingTop: 25 }}>
						<Button 
							className="ghost" 
							onClick={handlePreviusPage}
							disabled={Number(page) <= 1} 
						>
							⬅
						</Button>
						<div style={{ color: 'var(--muted)' }}>
							Página {page}
						</div>
						<Button className="ghost" onClick={handleNextPage}>
							➡
						</Button>
					</div>
				</div>
			</div>

			<UserFormModal
				open={isCreating || editingUser !== null}
				onClose={closeSubModal}
				user={editingUser}
				onUserCreated={handleUserCreated} 
				onUserUpdated={handleUserUpdated} 
			/>
			<EmailModal open={userToEmail !== null} user={userToEmail} onClose={closeSubModal} access_token={access_token ? access_token : null } />
			<ActionsModal
				user={actionUser}
				onClose={() => setActionUser(null)}
				onEdit={handleEditUser} 
				onEmail={openEmailModal}
				onDelete={handleDeleteUser}
			/>
		</div>
	)
}

function UserFormModal({ 
	open, 
	onClose, 
	user,
	onUserCreated,
	onUserUpdated 
}: {
	open: boolean
	onClose: () => void
	user: User | null
	onUserCreated: (user: User) => void
	onUserUpdated: () => void
}): JSX.Element {
	
	const { access_token } = useAuth();

	const nameRef = useRef<HTMLInputElement>(null);
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const roleRef = useRef<HTMLSelectElement>(null);
	const [isStatus, setIsStatus] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		if (user && open) {
			if (nameRef.current) nameRef.current.value = user.name || '';
			if (emailRef.current) emailRef.current.value = user.email || '';
			if (passwordRef.current) passwordRef.current.value = ''; 
			if (roleRef.current) roleRef.current.value = user.role || 'USER';
			setIsStatus(user.status ?? user.is_active ?? false);
		} else if (!user && open) {
			if (nameRef.current) nameRef.current.value = '';
			if (emailRef.current) emailRef.current.value = '';
			if (passwordRef.current) passwordRef.current.value = '';
			if (roleRef.current) roleRef.current.value = 'USER';
			setIsStatus(true);
		}
		setError(''); 
	}, [user, open]);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		e.stopPropagation();

		if (!access_token) {
			setError("Token não encontrado. Faça login novamente.");
			return;
		}

		if (!emailRef.current ||
			!nameRef.current ||
			!passwordRef.current ||
			!roleRef.current) {
			setError("Por favor preencha todos os campos necessários");
			return;
		}

		const dataUser = {
			id: "",
			name: nameRef.current.value,
			email: emailRef.current.value,
			password: passwordRef.current.value,
			role: roleRef.current.value,
			status: isStatus
		};

		try {
			if (user) {
				const updatedUserData = { ...dataUser };
					const updatedUser = await updateUser(updatedUserData,  access_token, user.id);
					if (updatedUser) {
						onUserUpdated();
						console.log("Usuário editado:", updatedUser);
				}
			} else {
				const newUserResponse = await createUser(dataUser, access_token);
				if (newUserResponse?.user) {
					onUserCreated(newUserResponse.user);
					console.log("Usuário criado:", newUserResponse.user);
				}
			}
			setError("");
			onClose();
		} catch (err: any) {
			setError(err.message || "Erro ao salvar usuário");
		}
	}

	return (
		<Modal open={open} onClose={onClose} title={user ? 'Editar Usuário' : 'Novo Usuário'}>
			<form style={{ display: 'grid', gap: 12 }}>
				<Input
					label="Nome"
					ref={nameRef}
					required
					placeholder="Digite o nome completo"
				/>
				<Input
					label="Email"
					type="email"
					ref={emailRef}
					required
					placeholder="Digite o email"
				/>
				<Input
					label={user ? "Nova Senha (deixe vazio para manter)" : "Senha"}
					type="password"
					ref={passwordRef}
					required={!user}
					placeholder={user ? "Digite nova senha (opcional)" : "Digite a senha"}
				/>
				<div className="row">
					<span>Status</span>
					<select
						value={isStatus ? "true" : "false"}
						onChange={(e) => setIsStatus(e.target.value === "true")}
					>
						<option value="true">Ativo</option>
						<option value="false">Inativo</option>
					</select>
				</div>
				<div className="row">
					<span>Role</span>
					<select ref={roleRef}>
						<option value="USER">USER</option>
						<option value="ADMIN">ADMIN</option>
					</select>
				</div>
				
				{error && <p style={{ color: "red", margin: 0 }}>{error}</p>}
				
				<div
					className="row"
					style={{ justifyContent: 'flex-end', gap: 8 }}
				>
					<Button
						className="ghost"
						type="button"
						onClick={onClose}
					>
						Cancelar
					</Button>
					<Button type="button" onClick={handleSubmit}>
						{user ? 'Atualizar' : 'Criar'}
					</Button>
				</div>
			</form>
		</Modal>
	)
}