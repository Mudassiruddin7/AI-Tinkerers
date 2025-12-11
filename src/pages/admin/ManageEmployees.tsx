import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import {
  Search,
  Plus,
  Mail,
  MoreVertical,
  Shield,
  UserX,
  CheckCircle,
  XCircle,
  Send,
} from 'lucide-react'
import { Card, CardContent, Button, Input, Modal, Badge } from '@/components/ui'
// import { formatDate } from '@/lib/utils'

interface Employee {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'admin' | 'employee'
  consentGiven: boolean
  consentDate?: string
  status: 'active' | 'pending' | 'inactive'
  completedCourses: number
  lastActive?: string
}

const mockEmployees: Employee[] = [
  {
    id: '1',
    email: 'sarah.johnson@company.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'employee',
    consentGiven: true,
    consentDate: '2024-11-15',
    status: 'active',
    completedCourses: 3,
    lastActive: '2024-12-08',
  },
  {
    id: '2',
    email: 'mike.chen@company.com',
    firstName: 'Mike',
    lastName: 'Chen',
    role: 'employee',
    consentGiven: true,
    consentDate: '2024-11-10',
    status: 'active',
    completedCourses: 2,
    lastActive: '2024-12-07',
  },
  {
    id: '3',
    email: 'emily.davis@company.com',
    firstName: 'Emily',
    lastName: 'Davis',
    role: 'admin',
    consentGiven: false,
    status: 'active',
    completedCourses: 5,
    lastActive: '2024-12-08',
  },
  {
    id: '4',
    email: 'alex.thompson@company.com',
    firstName: 'Alex',
    lastName: 'Thompson',
    role: 'employee',
    consentGiven: false,
    status: 'pending',
    completedCourses: 0,
  },
]

export function ManageEmployees() {
  const [employees, setEmployees] = useState(mockEmployees)
  const [searchQuery, setSearchQuery] = useState('')
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleInvite = () => {
    if (!inviteEmail) return
    
    toast.success(`Invitation sent to ${inviteEmail}`)
    setInviteEmail('')
    setIsInviteModalOpen(false)
  }

  const handleSendConsentRequest = (employeeId: string) => {
    const employee = employees.find(e => e.id === employeeId)
    if (employee) {
      toast.success(`Consent request sent to ${employee.firstName}`)
    }
    setOpenMenu(null)
  }

  const handleToggleRole = (employeeId: string) => {
    setEmployees(employees.map(emp => {
      if (emp.id === employeeId) {
        return { ...emp, role: emp.role === 'admin' ? 'employee' : 'admin' }
      }
      return emp
    }))
    toast.success('Role updated successfully')
    setOpenMenu(null)
  }

  const handleDeactivate = (employeeId: string) => {
    setEmployees(employees.map(emp => {
      if (emp.id === employeeId) {
        return { ...emp, status: emp.status === 'active' ? 'inactive' : 'active' }
      }
      return emp
    }))
    toast.success('Status updated successfully')
    setOpenMenu(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Employees</h1>
          <p className="text-gray-600 mt-1">Invite team members and manage their access</p>
        </div>
        <Button
          onClick={() => setIsInviteModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Invite Employee
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Employees', value: employees.length, color: 'text-primary-600' },
          { label: 'Active', value: employees.filter(e => e.status === 'active').length, color: 'text-green-600' },
          { label: 'Pending Invites', value: employees.filter(e => e.status === 'pending').length, color: 'text-yellow-600' },
          { label: 'Consent Given', value: employees.filter(e => e.consentGiven).length, color: 'text-accent-600' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="text-center py-4">
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Search employees..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Employee List */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Consent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completed
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEmployees.map((employee, index) => (
                  <motion.tr
                    key={employee.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-700">
                            {employee.firstName[0]}{employee.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {employee.firstName} {employee.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{employee.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={employee.role === 'admin' ? 'info' : 'default'}>
                        {employee.role === 'admin' ? (
                          <span className="flex items-center gap-1">
                            <Shield className="w-3 h-3" /> Admin
                          </span>
                        ) : (
                          'Employee'
                        )}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {employee.consentGiven ? (
                        <span className="flex items-center gap-1 text-green-600 text-sm">
                          <CheckCircle className="w-4 h-4" /> Given
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-gray-400 text-sm">
                          <XCircle className="w-4 h-4" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={
                          employee.status === 'active'
                            ? 'success'
                            : employee.status === 'pending'
                            ? 'warning'
                            : 'error'
                        }
                      >
                        {employee.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {employee.completedCourses} courses
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="relative">
                        <button
                          onClick={() => setOpenMenu(openMenu === employee.id ? null : employee.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-500" />
                        </button>
                        {openMenu === employee.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
                            {!employee.consentGiven && (
                              <button
                                onClick={() => handleSendConsentRequest(employee.id)}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full"
                              >
                                <Send className="w-4 h-4" /> Request Consent
                              </button>
                            )}
                            <button
                              onClick={() => handleToggleRole(employee.id)}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full"
                            >
                              <Shield className="w-4 h-4" />
                              {employee.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                            </button>
                            <button
                              onClick={() => handleDeactivate(employee.id)}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                            >
                              <UserX className="w-4 h-4" />
                              {employee.status === 'active' ? 'Deactivate' : 'Activate'}
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Invite Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite Employee"
      >
        <div className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="employee@company.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
          <p className="text-sm text-gray-500">
            An invitation email will be sent with instructions to join your organization.
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setIsInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInvite} leftIcon={<Mail className="w-4 h-4" />}>
              Send Invitation
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
