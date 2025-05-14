import React, { useState, useEffect } from 'react';
import { Project, api } from '../../lib/supabase';
import { CheckCircle, XCircle, MessageSquare, AlertCircle } from 'lucide-react';
import Button from '../../components/Button';

const ProjectAdminDashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const allProjects = await api.getProjects();
        setProjects(allProjects.filter(p => p.status === 'Pending'));
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleApprove = async (projectId: string) => {
    try {
      await api.approveProject(projectId, 'admin');
      setProjects(projects.filter(p => p.id !== projectId));
    } catch (error) {
      console.error('Error approving project:', error);
    }
  };

  const handleReject = async (projectId: string, feedback: string) => {
    try {
      await api.rejectProject(projectId, feedback);
      setProjects(projects.filter(p => p.id !== projectId));
      setSelectedProject(null);
      setFeedback('');
    } catch (error) {
      console.error('Error rejecting project:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Project Reviews</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {projects.map(project => (
          <div key={project.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">{project.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{project.description}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="ml-6 flex space-x-3">
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleApprove(project.id)}
                  leftIcon={<CheckCircle className="h-4 w-4" />}
                >
                  Approve
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setSelectedProject(project)}
                  leftIcon={<XCircle className="h-4 w-4" />}
                >
                  Reject
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => window.open(`/projects/${project.id}`, '_blank')}
                  leftIcon={<MessageSquare className="h-4 w-4" />}
                >
                  Preview
                </Button>
              </div>
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No pending projects to review
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Reject Project
                  </h3>
                  <div className="mt-2">
                    <textarea
                      rows={4}
                      className="shadow-sm block w-full focus:ring-red-500 focus:border-red-500 sm:text-sm border-gray-300 rounded-md"
                      placeholder="Provide feedback for rejection..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <Button
                  variant="danger"
                  onClick={() => {
                    handleReject(selectedProject.id, feedback);
                  }}
                >
                  Reject
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSelectedProject(null);
                    setFeedback('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectAdminDashboard;
